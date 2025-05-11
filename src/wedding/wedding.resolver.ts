import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { WeddingService } from './wedding.service';
import { CreateWeddingInput } from './dto/create-wedding.input';
import { UpdateWeddingInput } from './dto/update-wedding.input';
import { User, Wedding } from '@app/entities';
import { CurrentUser } from '@app/decorators';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@app/guards';

@Resolver(() => Wedding)
@UseGuards(AuthGuard)
export class WeddingResolver {
  constructor(private readonly weddingService: WeddingService) {}

  @Mutation(() => Wedding)
  createWedding(@Args('createWeddingInput') createWeddingInput: CreateWeddingInput, @CurrentUser() owner: User) {
    return this.weddingService.create(createWeddingInput, owner);
  }

  @Query(() => [Wedding], { name: 'weddings' })
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
