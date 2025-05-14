import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateGuestInput } from './dto/create-guest.input';
import { UpdateGuestInput } from './dto/update-guest.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Guest } from '@app/entities';
import { FindManyOptions, Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { WeddingService } from 'src/wedding/wedding.service';
import { PaginationInput } from '@app/dto';

@Injectable()
export class GuestService {
  constructor(
    @InjectRepository(Guest) private readonly guestRepository: Repository<Guest>,
    @Inject(forwardRef(() => WeddingService)) private readonly weddingService: WeddingService,
    @Inject(forwardRef(() => UserService)) private readonly userService: UserService,
  ) {}

  async create(createGuestInput: CreateGuestInput, userId: string) {
    const wedding = await this.weddingService.findOne(createGuestInput.weddingId);
    const user = await this.userService.findOne(userId);
    const guestData = this.guestRepository.create({ wedding, user, role: createGuestInput.role });
    return await this.guestRepository.save(guestData);
  }

  async findAll({ limit = 10, page = 1 }: PaginationInput) {
    const take = limit;
    const skip = limit * (page - 1);
    const [data, total] = await this.guestRepository.findAndCount({ take, skip });
    return { limit, page, total, data };
  }

  async findAllBy({ take = 10, skip = 0, ...option }: FindManyOptions<Guest>) {
    const limit = take;
    const page = skip + 1;
    const [data, total] = await this.guestRepository.findAndCount({ ...option, take, skip });
    return { limit, page, total, data };
  }

  async findOne(id: string) {
    const guest = await this.guestRepository.findOneBy({ id });
    if (!guest) throw new NotFoundException('Guest not found');
    return guest;
  }

  async update(id: string, updateGuestInput: UpdateGuestInput) {
    const guest = await this.findOne(id);
    Object.assign(guest, updateGuestInput);
    return await this.guestRepository.save(guest);
  }

  async remove(id: string) {
    const guest = await this.findOne(id);
    await this.guestRepository.remove(guest);
    return guest;
  }
}
