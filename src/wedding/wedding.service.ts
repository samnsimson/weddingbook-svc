import { Injectable } from '@nestjs/common';
import { CreateWeddingInput } from './dto/create-wedding.input';
import { UpdateWeddingInput } from './dto/update-wedding.input';
import { InjectRepository } from '@nestjs/typeorm';
import { User, Wedding } from '@app/entities';
import { FindManyOptions, Repository } from 'typeorm';
import { generateCode } from '@app/utils';

@Injectable()
export class WeddingService {
  constructor(@InjectRepository(Wedding) private readonly weddingRepository: Repository<Wedding>) {}

  async create(createWeddingInput: CreateWeddingInput, owner: User) {
    const weddingCode = generateCode();
    const wedding = this.weddingRepository.create({ ...createWeddingInput, code: weddingCode, owner });
    return await this.weddingRepository.save(wedding);
  }

  async findAll(option: FindManyOptions<Wedding> | undefined = undefined) {
    return await this.weddingRepository.find(option);
  }

  findOne(id: number) {
    return `This action returns a #${id} wedding`;
  }

  update(id: number, updateWeddingInput: UpdateWeddingInput) {
    return `This action updates a #${id} wedding`;
  }

  remove(id: number) {
    return `This action removes a #${id} wedding`;
  }
}
