import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { LoginEntity } from './entities/login.entity';
import { LoginInput } from './dto/login.input';
import { AuthService } from './auth.service';
import { User } from '@app/entities';
import { SignupInput } from './dto/signup.input';
import { RefreshResponse } from './dto/refresh.dto';
import { RefreshTokenInput } from './dto/refresh.input';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => LoginEntity)
  async login(@Args('loginInput') loginInput: LoginInput) {
    return await this.authService.login(loginInput);
  }

  @Mutation(() => User)
  async signup(@Args('signupInput') signupInput: SignupInput) {
    return await this.authService.signup(signupInput);
  }

  @Mutation(() => RefreshResponse)
  async refreshToken(@Args('refreshTokenInput') refreshTokenInput: RefreshTokenInput) {
    return await this.authService.refreshToken(refreshTokenInput);
  }
}
