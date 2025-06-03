import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { Post, User } from '@app/entities';
import { EventService } from 'src/event/event.service';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { MediaService } from 'src/media/media.service';
import { PaginationInput } from '@app/dto';
import { PaginatedPostResponse } from './dto/paginated-post-response.dto';

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);

  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @Inject(forwardRef(() => EventService)) private readonly eventService: EventService,
    @Inject(forwardRef(() => MediaService)) private readonly mediaService: MediaService,
  ) {}

  async create(createPostInput: CreatePostInput, user: User) {
    this.logger.log('Creating post', createPostInput);
    const { eventId, caption, media } = createPostInput;
    const event = await this.eventService.findOne(eventId);
    const medias = media ? await this.mediaService.create({ ...media, eventId }, user) : [];
    const post = this.postRepository.create({ caption, event, user, media: medias });
    return await this.postRepository.save(post);
  }

  async findAll(eventId: string, { page = 1, limit = 10 }: PaginationInput): Promise<PaginatedPostResponse> {
    this.logger.log(`Finding all posts for event ${eventId}. page: ${page}, limit: ${limit}`);
    const skip = limit * (page - 1);
    const where = { event: { id: eventId } };
    const relations = ['user', 'media', 'event'];
    const [posts, total] = await this.postRepository.findAndCount({ where, relations, take: limit, skip, order: { createdAt: 'DESC' } });
    return { limit, page, total, data: posts };
  }

  async findOne(id: string) {
    const post = await this.postRepository.findOne({ where: { id }, relations: ['user', 'media'] });
    if (!post) throw new Error(`Post with id ${id} not found`);
    return post;
  }

  async findBy(options: FindOptionsWhere<Post>, { page = 1, limit = 10 }: PaginationInput) {
    this.logger.log(`Finding post with options ${JSON.stringify(options)}. page: ${page}, limit: ${limit}`);
    const skip = limit * (page - 1);
    const where = { ...options };
    const relations = ['user', 'media', 'event'];
    const [posts, total] = await this.postRepository.findAndCount({ where, relations, take: limit, skip });
    return { limit, page, total, data: posts };
  }

  update(id: number, updatePostInput: UpdatePostInput) {
    console.log('🚀 ~ PostService ~ update ~ updatePostInput:', updatePostInput);
    return `This action updates a #${id} post`;
  }

  async remove(id: string) {
    const post = await this.findOne(id);
    await this.postRepository.remove(post);
    return post;
  }
}
