import { Resolver, Query, Mutation, Args, ResolveField, Parent, Int } from '@nestjs/graphql';
import { WeddingService } from './wedding.service';
import { CreateWeddingInput } from './dto/create-wedding.input';
import { UpdateWeddingInput } from './dto/update-wedding.input';
import { User, Wedding } from '@app/entities';
import { CurrentUser } from '@app/decorators';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@app/guards';
import { PaginatedWedding } from './dto/paginated-wedding.dto';
import { PaginationInput } from '@app/dto';
import { UploadWeddingImageInput } from './dto/upload-wedding-image.dto';
import { PaginatedWeddingGuests } from './dto/paginated-wedding-guests.dto';

@Resolver(() => Wedding)
@UseGuards(AuthGuard)
export class WeddingResolver {
  constructor(private readonly weddingService: WeddingService) {}

  @Mutation(() => Wedding)
  createWedding(@Args('createWeddingInput') createWeddingInput: CreateWeddingInput, @CurrentUser() owner: User) {
    return this.weddingService.create(createWeddingInput, owner);
  }

  @Query(() => PaginatedWedding, { name: 'weddings' })
  findAll(@Args('paginationInput', { nullable: true }) paginationInput: PaginationInput) {
    return this.weddingService.findAll(paginationInput);
  }

  @Query(() => PaginatedWedding, { name: 'myWeddings' })
  findMyWedding(@Args('paginationInput', { nullable: true }) paginationInput: PaginationInput, @CurrentUser('id') id: string) {
    return this.weddingService.findBy({ guests: { user: { id } } }, paginationInput);
  }

  @Query(() => Wedding, { name: 'wedding' })
  async findOne(@Args('id', { nullable: true }) id?: string, @Args('code', { type: () => Int, nullable: true }) code?: number) {
    if (!id && !code) throw new BadRequestException('Either "id" or "code" must be provided.');
    return id ? await this.weddingService.findOneBy({ id }) : await this.weddingService.findOneBy({ code });
  }

  @Mutation(() => Wedding, { name: 'uploadImage' })
  async uploadImage(@Args('uploadWeddingImageInput') uploadData: UploadWeddingImageInput, @CurrentUser() user: User) {
    return await this.weddingService.uploadImage(uploadData, user);
  }

  @Mutation(() => Wedding)
  updateWedding(@Args('updateWeddingInput') updateWeddingInput: UpdateWeddingInput) {
    return this.weddingService.update(updateWeddingInput.id, updateWeddingInput);
  }

  @Mutation(() => Wedding)
  removeWedding(@Args('id') id: string) {
    return this.weddingService.remove(id);
  }

  @ResolveField(() => PaginatedWeddingGuests, { name: 'guests' })
  async guests(@Args('paginationInput', { nullable: true }) paginationInput: PaginationInput, @Parent() wedding: Wedding) {
    return await this.weddingService.resolveGuests(paginationInput, wedding.id);
  }
}
