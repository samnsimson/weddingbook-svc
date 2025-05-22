import { forwardRef, Module } from '@nestjs/common';
import { WeddingService } from './wedding.service';
import { WeddingResolver } from './wedding.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wedding } from '@app/entities';
import { GuestModule } from 'src/guest/guest.module';
import { FileStorageModule } from 'src/file-storage/file-storage.module';

@Module({
  imports: [TypeOrmModule.forFeature([Wedding]), forwardRef(() => GuestModule), FileStorageModule],
  providers: [WeddingResolver, WeddingService],
  exports: [WeddingService],
})
export class WeddingModule {}
