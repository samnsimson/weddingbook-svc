import { Module } from '@nestjs/common';
import { WeddingService } from './wedding.service';
import { WeddingResolver } from './wedding.resolver';

@Module({
  providers: [WeddingResolver, WeddingService],
})
export class WeddingModule {}
