import { forwardRef, Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventResolver } from './event.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from '@app/entities';
import { GuestModule } from 'src/guest/guest.module';
import { FileStorageModule } from 'src/file-storage/file-storage.module';

@Module({
  imports: [TypeOrmModule.forFeature([Event]), forwardRef(() => GuestModule), FileStorageModule],
  providers: [EventResolver, EventService],
  exports: [EventService],
})
export class EventModule {}
