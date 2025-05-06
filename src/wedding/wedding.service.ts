import { Injectable } from '@nestjs/common';
import { CreateWeddingInput } from './dto/create-wedding.input';
import { UpdateWeddingInput } from './dto/update-wedding.input';

@Injectable()
export class WeddingService {
  create(createWeddingInput: CreateWeddingInput) {
    return 'This action adds a new wedding';
  }

  findAll() {
    return `This action returns all wedding`;
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
