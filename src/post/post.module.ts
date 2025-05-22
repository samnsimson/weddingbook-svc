import { forwardRef, Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostResolver } from './post.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '@app/entities/post.entity';
import { WeddingModule } from 'src/wedding/wedding.module';
import { MediaModule } from 'src/media/media.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), forwardRef(() => WeddingModule), forwardRef(() => MediaModule)],
  providers: [PostResolver, PostService],
  exports: [PostService],
})
export class PostModule {}
