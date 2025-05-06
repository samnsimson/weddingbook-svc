import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { WeddingService } from './wedding.service';
import { CreateWeddingInput } from './dto/create-wedding.input';
import { UpdateWeddingInput } from './dto/update-wedding.input';
import { Wedding } from '@app/entities';

@Resolver(() => Wedding)
export class WeddingResolver {
  constructor(private readonly weddingService: WeddingService) {}

  @Mutation(() => Wedding)
  createWedding(@Args('createWeddingInput') createWeddingInput: CreateWeddingInput) {
    return this.weddingService.create(createWeddingInput);
  }

  @Query(() => [Wedding], { name: 'wedding' })
  findAll() {
    return this.weddingService.findAll();
  }

  @Query(() => Wedding, { name: 'wedding' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.weddingService.findOne(id);
  }

  @Mutation(() => Wedding)
  updateWedding(@Args('updateWeddingInput') updateWeddingInput: UpdateWeddingInput) {
    return this.weddingService.update(updateWeddingInput.id, updateWeddingInput);
  }

  @Mutation(() => Wedding)
  removeWedding(@Args('id', { type: () => Int }) id: number) {
    return this.weddingService.remove(id);
  }
}
