import { BadRequestException, ForbiddenException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { LoginInput } from './dto/login.input';
import { JwtPayload } from '@app/types';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { compare } from 'bcrypt';
import { LoginEntity } from './entities/login.entity';
import { SignupInput } from './dto/signup.input';
import { User } from '@app/entities';
import { RefreshTokenInput } from './dto/refresh.input';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login({ username, password }: LoginInput): Promise<LoginEntity> {
    try {
      this.logger.log(`Logging in user: ${JSON.stringify({ username })}`);
      const user = await this.userService.findOneBy({ where: [{ username }, { email: username }] });
      const isPasswordValid = await compare(password, user.password);
      if (!isPasswordValid) throw new UnauthorizedException('Wrong password');
      const { id, email } = this.verifyUserStatus(user);
      const tokenPayload: JwtPayload = { sub: id, id, email, role: 'guest' };
      const tokenData = await this.generateToken(tokenPayload);
      return { authenticated: true, ...tokenData };
    } catch (error: any) {
      this.logger.error(`Login Error: ${JSON.stringify(error.response)}`);
      throw error;
    }
  }

  async signup(signupInput: SignupInput): Promise<User> {
    try {
      if (signupInput.password !== signupInput.confirmPassword) throw new BadRequestException('Passwords do not match');
      this.logger.log(`New user signup: ${JSON.stringify(signupInput.email)}`);
      const user = await this.userService.create(signupInput);
      return user;
    } catch (error) {
      this.logger.error(`Signup Error: ${JSON.stringify(error.response)}`);
      throw error;
    }
  }

  async refreshToken({ refreshToken }: RefreshTokenInput) {
    try {
      const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');
      const payload = await this.jwtService.verifyAsync<JwtPayload>(refreshToken, { secret: refreshSecret });
      const { id, email } = await this.validateUser(payload);
      const { tokenType, accessToken } = await this.generateToken({ sub: id, id, email, role: 'guest' });
      return { tokenType, accessToken };
    } catch (error) {
      this.logger.error(`Refresh token error: ${JSON.stringify(error.response)}`);
      throw error;
    }
  }

  async generateToken(payload: JwtPayload) {
    try {
      this.logger.log('Generating JWT Token');
      const accessToken = await this.jwtService.signAsync(payload);
      const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');
      const refreshExpiry = this.configService.get<string>('JWT_REFRESH_EXPIRY');
      const refreshOptions = { secret: refreshSecret, expiresIn: refreshExpiry };
      const refreshToken = await this.jwtService.signAsync(payload, refreshOptions);
      return { tokenType: 'Bearer', accessToken, refreshToken };
    } catch (error: any) {
      this.logger.error(`Token generation error: ${JSON.stringify(error.response)}`);
      throw error;
    }
  }

  verifyUserStatus(user: User): User {
    try {
      this.logger.log(`Authorizing User: ${JSON.stringify({ id: user.id })}`);
      const isCommunicationsVerified = user.isEmailVerified || user.isPhoneVerified;
      if (user.deletedAt) throw new ForbiddenException('User account deleted');
      if (!isCommunicationsVerified) throw new ForbiddenException('Email/Phone verification is required');
      if (!user.isActive) throw new ForbiddenException('User account is not active');
      return user;
    } catch (error) {
      this.logger.error(`Authorization Error: ${JSON.stringify(error.response)}`);
      throw error;
    }
  }

  async validateUser(payload: JwtPayload) {
    try {
      this.logger.log(`Authenticating User: ${JSON.stringify({ id: payload.id })}`);
      const user = await this.userService.findOne(payload.id);
      return this.verifyUserStatus(user);
    } catch (error: any) {
      this.logger.error(`Authentication Error: ${JSON.stringify(error.response)}`);
      throw error;
    }
  }
}
