import { forwardRef, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';
import { InjectRepository } from '@nestjs/typeorm';
import { User, Event, Guest } from '@app/entities';
import { FindOptionsWhere, Repository } from 'typeorm';
import { generateCode } from '@app/utils';
import { PaginatedEvent } from './dto/paginated-event.dto';
import { PaginationInput } from '@app/dto';
import { GuestRole } from '@app/types';
import { GuestService } from 'src/guest/guest.service';

@Injectable()
export class EventService {
  private readonly logger: Logger;

  constructor(
    @InjectRepository(Event) private readonly eventRepository: Repository<Event>,
    @Inject(forwardRef(() => GuestService)) private readonly guestService: GuestService,
  ) {
    this.logger = new Logger(EventService.name);
  }

  async create(createEventInput: CreateEventInput, owner: User) {
    return await this.eventRepository.manager.transaction(async (em) => {
      const eventCode = generateCode();
      this.logger.log(`Creating a new event with code: ${eventCode}`);
      const event = em.create(Event, { ...createEventInput, code: eventCode, owner });
      const savedEvent = await em.save(event);
      this.logger.log(`Adding user as a guest to the event`);
      const guest = em.create(Guest, { user: owner, event: savedEvent, role: GuestRole.OWNER });
      await em.save(guest);
      return savedEvent;
    });
  }

  async findAll({ limit = 10, page = 1 }: PaginationInput): Promise<PaginatedEvent> {
    const skip = limit * (page - 1);
    const [data, total] = await this.eventRepository.findAndCount({ take: limit, skip });
    return { limit, page, total, data };
  }

  async findBy(options: FindOptionsWhere<Event>, { limit = 10, page = 1 }: PaginationInput) {
    const skip = limit * (page - 1);
    const [data, total] = await this.eventRepository.findAndCount({ where: options, take: limit, skip, order: { date: 'ASC' } });
    return { limit, page, total, data };
  }

  async findOne(id: string) {
    this.logger.log(`Finding event by id: ${id}`);
    const event = await this.eventRepository.findOneBy({ id });
    if (!event) throw new NotFoundException('Event not found');
    return event;
  }

  async findOneBy(options: FindOptionsWhere<Event>) {
    this.logger.log(`Finding event by option: ${JSON.stringify(options)}`);
    const event = await this.eventRepository.findOneBy(options);
    if (!event) throw new NotFoundException('Event not found');
    return event;
  }

  async update(id: string, updateEventInput: UpdateEventInput) {
    this.logger.log(`Update event with id: ${id}`);
    const event = await this.findOne(id);
    Object.assign(event, updateEventInput);
    return await this.eventRepository.save(event);
  }

  async remove(id: string) {
    this.logger.log(`Deleting event with id: ${id}`);
    const event = await this.findOne(id);
    await this.eventRepository.remove(event);
    return event;
  }

  // async uploadImage(uploadData: UploadEventImageInput, user: User) {
  //   this.logger.log(`Begining upload image process for ${uploadData.for}`);
  //   const { eventId, image: file, for: imageFor } = uploadData;
  //   const uploadResult = await this.fileStorageService.uploadImage(file);
  //   const imageData = imageFor === ImageFor.BRIDE ? { brideImageUrl: uploadResult.location } : { groomImageUrl: uploadResult.location };
  //   this.logger.log(`Image data: ${JSON.stringify(imageData)}`);
  //   return await this.eventRepository.update({ id: eventId, owner: { id: user.id } }, imageData);
  // }

  async resolveGuests({ limit = 10, page = 1 }: PaginationInput, eventId: string) {
    const skip = limit * (page - 1);
    const select = { user: true };
    const where = { event: { id: eventId }, role: GuestRole.GUEST };
    this.logger.log(`Resolving guest field for: ${JSON.stringify(where)}`);
    const guests = await this.guestService.findAllBy({ select, where, relations: ['user'], take: limit, skip });
    const guestList = guests.data.map((data) => data.user);
    return { limit, page, total: guests.total, data: guestList };
  }
}
