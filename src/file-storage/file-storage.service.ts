/* eslint-disable @typescript-eslint/unbound-method */
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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

  async uploadImages(files: Promise<FileUpload[]>) {
    this.logger.log(`Uploading images...`);
    const fileUploads = await files;
    const uploadPromises = fileUploads.map(async (file) => {
      const { createReadStream, filename, mimetype } = file;
      if (!mimetype.startsWith('image/')) throw new InternalServerErrorException('Only image files are allowed');
      const fileExt = filename.split('.').pop();
      const key = `images/${Date.now()}.${fileExt}`;
      this.logger.log(`Image path: ${key}`);
      return await this.uploadToS3(createReadStream(), key, mimetype);
    });
    const uploadResults = await Promise.all(uploadPromises);
    return uploadResults.map((result) => result);
  }

  async uploadImage(file: Promise<FileUpload>) {
    this.logger.log(`Uploading image...`);
    const { createReadStream, filename, mimetype } = await file;
    if (!mimetype.startsWith('image/')) throw new InternalServerErrorException('Only image files are allowed');
    const fileExt = filename.split('.').pop();
    const key = `images/${Date.now()}.${fileExt}`;
    this.logger.log(`Image path: ${key}`);
    return await this.uploadToS3(createReadStream(), key, mimetype);
  }

  async uploadVideo(file: Promise<FileUpload>) {
    this.logger.log(`Uploading video...`);
    const { createReadStream, filename, mimetype } = await file;
    if (!mimetype.startsWith('video/')) throw new InternalServerErrorException('Only video files are allowed');
    const fileExt = filename.split('.').pop();
    const key = `videos/${Date.now()}.${fileExt}`;
    this.logger.log(`Video path: ${key}`);
    return await this.uploadToS3(createReadStream(), key, mimetype);
  }
}
