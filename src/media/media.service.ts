import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateMediaInput } from './dto/create-media.input';
import { UpdateMediaInput } from './dto/update-media.input';
import { Media, User } from '@app/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { WeddingService } from 'src/wedding/wedding.service';
import { FileStorageService } from 'src/file-storage/file-storage.service';
import { PaginationInput } from '@app/dto';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media) private readonly mediaRepository: Repository<Media>,
    @Inject(forwardRef(() => WeddingService)) private readonly weddingService: WeddingService,
    private readonly fileStorageService: FileStorageService,
  ) {}

  async create({ weddingId, file, mediaType }: CreateMediaInput, uploadedBy: User) {
    const wedding = await this.weddingService.findOne(weddingId);
    const fileData = await this.fileStorageService.uploadImages(file);
    const medias = fileData.map(({ location: url }) => this.mediaRepository.create({ url, wedding, uploadedBy, mediaType }));
    return await this.mediaRepository.save(medias);
  }

  async findAll(weddingId: string, { page = 1, limit = 10 }: PaginationInput) {
    const skip = limit * (page - 1);
    const [data, total] = await this.mediaRepository.findAndCount({ where: { wedding: { id: weddingId } }, take: limit, skip });
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
