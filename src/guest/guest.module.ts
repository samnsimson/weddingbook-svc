import { forwardRef, Module } from '@nestjs/common';
import { GuestService } from './guest.service';
import { GuestResolver } from './guest.resolver';
import { UserModule } from 'src/user/user.module';
import { WeddingModule } from 'src/wedding/wedding.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Guest } from '@app/entities';

@Module({
  imports: [forwardRef(() => UserModule), forwardRef(() => WeddingModule), TypeOrmModule.forFeature([Guest])],
  providers: [GuestResolver, GuestService],
  exports: [GuestService],
})
export class GuestModule {}
