import { forwardRef, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';
import { InjectRepository } from '@nestjs/typeorm';
import { User, Event } from '@app/entities';
import { FindOptionsWhere, Repository } from 'typeorm';
import { generateCode } from '@app/utils';
import { PaginatedEvent } from './dto/paginated-event.dto';
import { PaginationInput } from '@app/dto';
import { GuestRole } from '@app/types';
import { GuestService } from 'src/guest/guest.service';
import { FileStorageService } from 'src/file-storage/file-storage.service';

@Injectable()
export class EventService {
  private readonly logger: Logger;

  constructor(
    @InjectRepository(Event) private readonly weddingRepository: Repository<Event>,
    @Inject(forwardRef(() => GuestService)) private readonly guestService: GuestService,
    private readonly fileStorageService: FileStorageService,
  ) {
    this.logger = new Logger(EventService.name);
  }

  async create(createEventInput: CreateEventInput, owner: User) {
    const weddingCode = generateCode();
    this.logger.log(`Creating a new wedding with code: ${weddingCode}`);
    const wedding = this.weddingRepository.create({ ...createEventInput, code: weddingCode, owner });
    return await this.weddingRepository.save(wedding);
  }

  async findAll({ limit = 10, page = 1 }: PaginationInput): Promise<PaginatedEvent> {
    const skip = limit * (page - 1);
    const [data, total] = await this.weddingRepository.findAndCount({ take: limit, skip });
    return { limit, page, total, data };
  }

  async findBy(options: FindOptionsWhere<Event>, { limit = 10, page = 1 }: PaginationInput) {
    const skip = limit * (page - 1);
    const [data, total] = await this.weddingRepository.findAndCount({ where: options, take: limit, skip, order: { date: 'ASC' } });
    return { limit, page, total, data };
  }

  async findOne(id: string) {
    this.logger.log(`Finding wedding by id: ${id}`);
    const wedding = await this.weddingRepository.findOneBy({ id });
    if (!wedding) throw new NotFoundException('Event not found');
    return wedding;
  }

  async findOneBy(options: FindOptionsWhere<Event>) {
    this.logger.log(`Finding wedding by option: ${JSON.stringify(options)}`);
    const wedding = await this.weddingRepository.findOneBy(options);
    if (!wedding) throw new NotFoundException('Event not found');
    return wedding;
  }

  async update(id: string, updateEventInput: UpdateEventInput) {
    this.logger.log(`Update wedding with id: ${id}`);
    const wedding = await this.findOne(id);
    Object.assign(wedding, updateEventInput);
    return await this.weddingRepository.save(wedding);
  }

  async remove(id: string) {
    this.logger.log(`Deleting wedding with id: ${id}`);
    const wedding = await this.findOne(id);
    await this.weddingRepository.remove(wedding);
    return wedding;
  }

  // async uploadImage(uploadData: UploadEventImageInput, user: User) {
  //   this.logger.log(`Begining upload image process for ${uploadData.for}`);
  //   const { weddingId, image: file, for: imageFor } = uploadData;
  //   const uploadResult = await this.fileStorageService.uploadImage(file);
  //   const imageData = imageFor === ImageFor.BRIDE ? { brideImageUrl: uploadResult.location } : { groomImageUrl: uploadResult.location };
  //   this.logger.log(`Image data: ${JSON.stringify(imageData)}`);
  //   return await this.weddingRepository.update({ id: weddingId, owner: { id: user.id } }, imageData);
  // }

  async resolveGuests({ limit = 10, page = 1 }: PaginationInput, weddingId: string) {
    const skip = limit * (page - 1);
    const select = { user: true };
    const where = { wedding: { id: weddingId }, role: GuestRole.GUEST };
    this.logger.log(`Resolving guest field for: ${JSON.stringify(where)}`);
    const guests = await this.guestService.findAllBy({ select, where, relations: ['user'], take: limit, skip });
    const guestList = guests.data.map((data) => data.user);
    return { limit, page, total: guests.total, data: guestList };
  }
}
