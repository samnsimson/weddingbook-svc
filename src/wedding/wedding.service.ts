import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWeddingInput } from './dto/create-wedding.input';
import { UpdateWeddingInput } from './dto/update-wedding.input';
import { InjectRepository } from '@nestjs/typeorm';
import { User, Wedding } from '@app/entities';
import { Repository } from 'typeorm';
import { generateCode } from '@app/utils';
import { PaginatedWedding } from './dto/paginated-wedding.dto';
import { PaginationInput } from '@app/dto';

@Injectable()
export class WeddingService {
  constructor(@InjectRepository(Wedding) private readonly weddingRepository: Repository<Wedding>) {}

  async create(createWeddingInput: CreateWeddingInput, owner: User) {
    const weddingCode = generateCode();
    const wedding = this.weddingRepository.create({ ...createWeddingInput, code: weddingCode, owner });
    return await this.weddingRepository.save(wedding);
  }

  async findAll({ limit = 10, page = 1 }: PaginationInput): Promise<PaginatedWedding> {
    const skip = limit * (page - 1);
    const [data, total] = await this.weddingRepository.findAndCount({ take: limit, skip });
    return { limit, page, total, data };
  }

  async findOne(id: string) {
    const wedding = await this.weddingRepository.findOneBy({ id });
    if (!wedding) throw new NotFoundException('Wedding not found');
    return wedding;
  }

  async update(id: string, updateWeddingInput: UpdateWeddingInput) {
    const wedding = await this.findOne(id);
    Object.assign(wedding, updateWeddingInput);
    return await this.weddingRepository.save(wedding);
  }

  async remove(id: string) {
    const wedding = await this.findOne(id);
    await this.weddingRepository.remove(wedding);
    return wedding;
  }
}
