import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { WeddingService } from './wedding.service';
import { CreateWeddingInput } from './dto/create-wedding.input';
import { UpdateWeddingInput } from './dto/update-wedding.input';
import { User, Wedding } from '@app/entities';
import { CurrentUser } from '@app/decorators';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@app/guards';
import { PaginatedWedding } from './dto/paginated-wedding.dto';
import { PaginationInput } from '@app/dto';

@Resolver(() => Wedding)
@UseGuards(AuthGuard)
export class WeddingResolver {
  constructor(private readonly weddingService: WeddingService) {}

  @Mutation(() => Wedding)
  createWedding(@Args('createWeddingInput') createWeddingInput: CreateWeddingInput, @CurrentUser() owner: User) {
    return this.weddingService.create(createWeddingInput, owner);
  }

  @Query(() => PaginatedWedding, { name: 'weddings' })
  findAll(@Args('paginationInput', { nullable: true, defaultValue: { limit: 10, page: 1 } }) paginationInput: PaginationInput) {
    return this.weddingService.findAll(paginationInput);
  }

  @Query(() => Wedding, { name: 'wedding' })
  findOne(@Args('id') id: string) {
    return this.weddingService.findOne(id);
  }

  @Mutation(() => Wedding)
  updateWedding(@Args('updateWeddingInput') updateWeddingInput: UpdateWeddingInput) {
    return this.weddingService.update(updateWeddingInput.id, updateWeddingInput);
  }

  @Mutation(() => Wedding)
  removeWedding(@Args('id') id: string) {
    return this.weddingService.remove(id);
  }
}
