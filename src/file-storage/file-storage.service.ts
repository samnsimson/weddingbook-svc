/* eslint-disable @typescript-eslint/unbound-method */
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable, InternalServerErrorException, Logger, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { FileUpload } from 'graphql-upload-ts';
import { Readable } from 'stream';

@Injectable()
export class FileStorageService {
  private readonly s3: S3Client;
  private readonly logger = new Logger(FileStorageService.name);

  constructor(private readonly configService: ConfigService) {
    const awsRegion = this.configService.getOrThrow<string>('AWS_REGION');
    const accessKeyId = this.configService.getOrThrow<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.getOrThrow<string>('AWS_SECRET_ACCESS_KEY');
    this.s3 = new S3Client({ region: awsRegion, credentials: { accessKeyId, secretAccessKey } });
  }

  private async streamToBuffer(stream: Readable) {
    return new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', (err) => reject(err));
    });
  }

  private async uploadToS3(buffer: Buffer, key: string, contentType: string) {
    try {
      const Key = key;
      const Body = buffer;
      const ContentType = contentType;
      const ACL = 'public-read';
      const Bucket = this.configService.getOrThrow('AWS_S3_BUCKET_NAME');
      const command = new PutObjectCommand({ Bucket, Key, Body, ContentType, ACL });
      await this.s3.send(command);
      const location = `https://${Bucket}.s3.amazonaws.com/${key}`;
      this.logger.log(`Image url: ${location}`);
      return { location };
    } catch (error) {
      throw new InternalServerErrorException(`Failed to upload image to S3: ${error.message}`);
    }
  }

  async uploadImages(files: Array<Promise<FileUpload>>) {
    this.logger.log(`Bulk uploading images...`);
    return await Promise.all(files.map(async (file) => await this.uploadImage(file)));
  }

  async uploadImage(file: Promise<FileUpload>) {
    this.logger.log(`Uploading image...`);
    const { createReadStream, filename, mimetype } = await file;
    if (!mimetype.startsWith('image/')) throw new UnprocessableEntityException('Only image files are allowed');
    const fileExt = filename.split('.').pop();
    const key = `images/${randomUUID()}.${fileExt}`;
    this.logger.log(`Image path: ${key}`);
    const buffer = await this.streamToBuffer(createReadStream());
    return await this.uploadToS3(buffer, key, mimetype);
  }

  async uploadVideo(file: Promise<FileUpload>) {
    this.logger.log(`Uploading video...`);
    const { createReadStream, filename, mimetype } = await file;
    if (!mimetype.startsWith('video/')) throw new UnprocessableEntityException('Only video files are allowed');
    const fileExt = filename.split('.').pop();
    const key = `videos/${randomUUID()}.${fileExt}`;
    this.logger.log(`Video path: ${key}`);
    const buffer = await this.streamToBuffer(createReadStream());
    return await this.uploadToS3(buffer, key, mimetype);
  }
}
