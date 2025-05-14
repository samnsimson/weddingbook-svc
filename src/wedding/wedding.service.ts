/* eslint-disable @typescript-eslint/unbound-method */
import { BadRequestException, forwardRef, Inject, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateWeddingInput } from './dto/create-wedding.input';
import { UpdateWeddingInput } from './dto/update-wedding.input';
import { InjectRepository } from '@nestjs/typeorm';
import { User, Wedding } from '@app/entities';
import { FindOptionsWhere, Repository } from 'typeorm';
import { generateCode } from '@app/utils';
import { PaginatedWedding } from './dto/paginated-wedding.dto';
import { PaginationInput } from '@app/dto';
import { UploadWeddingImageInput } from './dto/upload-wedding-image.dto';
import { ConfigService } from '@nestjs/config';
import { GuestRole, ImageFor } from '@app/types';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import { GuestService } from 'src/guest/guest.service';

@Injectable()
export class WeddingService {
  private readonly s3: S3Client;
  private readonly logger: Logger;

  constructor(
    @InjectRepository(Wedding) private readonly weddingRepository: Repository<Wedding>,
    @Inject(forwardRef(() => GuestService)) private readonly guestService: GuestService,
    private readonly configService: ConfigService,
  ) {
    const awsRegion = this.configService.getOrThrow<string>('AWS_REGION');
    const accessKeyId = this.configService.getOrThrow<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.getOrThrow<string>('AWS_SECRET_ACCESS_KEY');
    this.s3 = new S3Client({ region: awsRegion, credentials: { accessKeyId, secretAccessKey } });
    this.logger = new Logger(WeddingService.name);
  }

  async create(createWeddingInput: CreateWeddingInput, owner: User) {
    const weddingCode = generateCode();
    this.logger.log(`Creating a new wedding with code: ${weddingCode}`);
    const wedding = this.weddingRepository.create({ ...createWeddingInput, code: weddingCode, owner });
    return await this.weddingRepository.save(wedding);
  }

  async findAll({ limit = 10, page = 1 }: PaginationInput): Promise<PaginatedWedding> {
    const skip = limit * (page - 1);
    const [data, total] = await this.weddingRepository.findAndCount({ take: limit, skip });
    return { limit, page, total, data };
  }

  async findOne(id: string) {
    this.logger.log(`Finding wedding by id: ${id}`);
    const wedding = await this.weddingRepository.findOneBy({ id });
    if (!wedding) throw new NotFoundException('Wedding not found');
    return wedding;
  }

  async findOneBy(options: FindOptionsWhere<Wedding>) {
    this.logger.log(`Finding wedding by option: ${JSON.stringify(options)}`);
    const wedding = await this.weddingRepository.findOneBy(options);
    if (!wedding) throw new NotFoundException('Wedding not found');
    return wedding;
  }

  async update(id: string, updateWeddingInput: UpdateWeddingInput) {
    this.logger.log(`Update wedding with id: ${id}`);
    const wedding = await this.findOne(id);
    Object.assign(wedding, updateWeddingInput);
    return await this.weddingRepository.save(wedding);
  }

  async remove(id: string) {
    this.logger.log(`Deleting wedding with id: ${id}`);
    const wedding = await this.findOne(id);
    await this.weddingRepository.remove(wedding);
    return wedding;
  }

  async uploadImage(uploadData: UploadWeddingImageInput, user: User) {
    this.logger.log(`Begining upload image process for ${uploadData.for}`);
    const { weddingId, image: file, for: imageFor } = uploadData;
    const { createReadStream, filename, mimetype } = await file;
    if (!mimetype.startsWith('image/')) throw new BadRequestException('Only image files are allowed');
    const fileExt = filename.split('.').pop();
    const key = `weddings/${weddingId}/${Date.now()}.${fileExt}`;
    this.logger.log(`Image path: ${key}`);
    const uploadResult = await this.uploadToS3(createReadStream(), key, mimetype);
    const imageData = imageFor === ImageFor.BRIDE ? { brideImageUrl: uploadResult.location } : { groomImageUrl: uploadResult.location };
    this.logger.log(`Image data: ${JSON.stringify(imageData)}`);
    return await this.weddingRepository.update({ id: weddingId, owner: { id: user.id } }, imageData);
  }

  private async uploadToS3(stream: Readable, key: string, contentType: string) {
    const Key = key;
    const Body = stream;
    const ContentType = contentType;
    const ACL = 'public-read';
    const Bucket = this.configService.getOrThrow('AWS_S3_BUCKET_NAME');
    const command = new PutObjectCommand({ Bucket, Key, Body, ContentType, ACL });
    this.logger.log(`PutObjectCommand: ${JSON.stringify(command)}`);
    try {
      await this.s3.send(command);
      const location = `https://${Bucket}.s3.amazonaws.com/${key}`;
      this.logger.log(`Image url: ${location}`);
      return { location };
    } catch (error) {
      throw new InternalServerErrorException(`Failed to upload image to S3: ${error.message}`);
    }
  }

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
