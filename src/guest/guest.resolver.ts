import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { GuestService } from './guest.service';
import { CreateGuestInput } from './dto/create-guest.input';
import { UpdateGuestInput } from './dto/update-guest.input';
import { Guest, User } from '@app/entities';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@app/guards';
import { CurrentUser } from '@app/decorators';
import { PaginationInput } from '@app/dto';
import { PaginatedGuest } from './dto/paginated-guest.dto';

@Resolver(() => Guest)
@UseGuards(AuthGuard)
export class GuestResolver {
  constructor(private readonly guestService: GuestService) {}

  @Mutation(() => Guest)
  createGuest(@Args('createGuestInput') createGuestInput: CreateGuestInput, @CurrentUser() { id }: User) {
    return this.guestService.create(createGuestInput, id);
  }

  @Query(() => PaginatedGuest, { name: 'guests' })
  findAll(@Args('paginationInput', { nullable: true }) paginationInput: PaginationInput) {
    return this.guestService.findAll(paginationInput);
  }

  @Query(() => Guest, { name: 'guest' })
  findOne(@Args('id') id: string) {
    return this.guestService.findOne(id);
  }

  @Mutation(() => Guest)
  updateGuest(@Args('updateGuestInput') updateGuestInput: UpdateGuestInput) {
    return this.guestService.update(updateGuestInput.id, updateGuestInput);
  }

  @Mutation(() => Guest)
  removeGuest(@Args('id') id: string) {
    return this.guestService.remove(id);
  }
}
