import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateMediaInput } from './dto/create-media.input';
import { UpdateMediaInput } from './dto/update-media.input';
import { Media, User } from '@app/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { EventService } from 'src/event/event.service';
import { FileStorageService } from 'src/file-storage/file-storage.service';
import { PaginationInput } from '@app/dto';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media) private readonly mediaRepository: Repository<Media>,
    @Inject(forwardRef(() => EventService)) private readonly eventService: EventService,
    private readonly fileStorageService: FileStorageService,
  ) {}

  async create({ eventId, file, mediaType }: CreateMediaInput, uploadedBy: User) {
    const event = await this.eventService.findOne(eventId);
    const fileData = await this.fileStorageService.uploadImages(file);
    const medias = fileData.map(({ location: url }) => this.mediaRepository.create({ url, event, uploadedBy, mediaType }));
    return await this.mediaRepository.save(medias);
  }

  async findAll(eventId: string, { page = 1, limit = 10 }: PaginationInput) {
    const skip = limit * (page - 1);
    const relations = ['uploadedBy', 'event'];
    const where = { event: { id: eventId } };
    const [data, total] = await this.mediaRepository.findAndCount({ where, relations, take: limit, skip });
    return { limit, page, total, data };
  }

  async findOneBy(options: FindOptionsWhere<Media>) {
    const media = await this.mediaRepository.findOneBy(options);
    if (!media) throw new Error('Media not found');
    return media;
  }

  async findOne(id: string) {
    const media = await this.mediaRepository.findOneBy({ id });
    if (!media) throw new Error('Media not found');
    return media;
  }

  update(id: string, updateMediaInput: UpdateMediaInput) {
    console.log('🚀 ~ MediaService ~ update ~ updateMediaInput:', updateMediaInput);
    return `This action updates a #${id} media`;
  }

  async remove(id: string) {
    const media = await this.findOne(id);
    return this.mediaRepository.remove(media);
  }
}
