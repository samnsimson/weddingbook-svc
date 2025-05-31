import { Resolver, Query, Mutation, Args, ResolveField, Parent, Int } from '@nestjs/graphql';
import { EventService } from './event.service';
import { CreateEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';
import { User, Event } from '@app/entities';
import { CurrentUser } from '@app/decorators';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@app/guards';
import { PaginatedEvent } from './dto/paginated-event.dto';
import { PaginationInput } from '@app/dto';
import { PaginatedEventGuests } from './dto/paginated-event-guests.dto';

@Resolver(() => Event)
@UseGuards(AuthGuard)
export class EventResolver {
  constructor(private readonly weddingService: EventService) {}

  @Mutation(() => Event)
  createEvent(@Args('createEventInput') createEventInput: CreateEventInput, @CurrentUser() owner: User) {
    return this.weddingService.create(createEventInput, owner);
  }

  @Query(() => PaginatedEvent, { name: 'weddings' })
  findAll(@Args('paginationInput', { nullable: true }) paginationInput: PaginationInput) {
    return this.weddingService.findAll(paginationInput);
  }

  @Query(() => PaginatedEvent, { name: 'myEvents' })
  findMyEvent(@Args('paginationInput', { nullable: true }) paginationInput: PaginationInput, @CurrentUser('id') id: string) {
    return this.weddingService.findBy({ guests: { user: { id } } }, paginationInput);
  }

  @Query(() => Event, { name: 'wedding' })
  async findOne(@Args('id', { nullable: true }) id?: string, @Args('code', { type: () => Int, nullable: true }) code?: number) {
    if (!id && !code) throw new BadRequestException('Either "id" or "code" must be provided.');
    return id ? await this.weddingService.findOneBy({ id }) : await this.weddingService.findOneBy({ code });
  }

  // @Mutation(() => Event, { name: 'uploadImage' })
  // async uploadImage(@Args('uploadEventImageInput') uploadData: UploadEventImageInput, @CurrentUser() user: User) {
  //   return await this.weddingService.uploadImage(uploadData, user);
  // }

  @Mutation(() => Event)
  updateEvent(@Args('updateEventInput') updateEventInput: UpdateEventInput) {
    return this.weddingService.update(updateEventInput.id, updateEventInput);
  }

  @Mutation(() => Event)
  removeEvent(@Args('id') id: string) {
    return this.weddingService.remove(id);
  }

  @ResolveField(() => PaginatedEventGuests, { name: 'guests' })
  async guests(@Args('paginationInput', { nullable: true }) paginationInput: PaginationInput, @Parent() wedding: Event) {
    return await this.weddingService.resolveGuests(paginationInput, wedding.id);
  }
}
