import { Module } from '@nestjs/common';
import { WeddingService } from './wedding.service';
import { WeddingResolver } from './wedding.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wedding } from '@app/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Wedding])],
  providers: [WeddingResolver, WeddingService],
})
export class WeddingModule {}
