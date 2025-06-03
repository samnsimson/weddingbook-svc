import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
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
import { FindEventInput } from './dto/find-event.input';

@Resolver(() => Event)
@UseGuards(AuthGuard)
export class EventResolver {
  constructor(private readonly eventService: EventService) {}

  @Mutation(() => Event)
  createEvent(@Args('createEventInput') createEventInput: CreateEventInput, @CurrentUser() owner: User) {
    return this.eventService.create(createEventInput, owner);
  }

  @Query(() => PaginatedEvent, { name: 'events' })
  findAll(@Args('paginationInput', { nullable: true }) paginationInput: PaginationInput) {
    return this.eventService.findAll(paginationInput);
  }

  @Query(() => PaginatedEvent, { name: 'myEvents' })
  findMyEvent(@Args('paginationInput', { nullable: true }) paginationInput: PaginationInput, @CurrentUser('id') id: string) {
    return this.eventService.findBy({ guests: { user: { id } } }, paginationInput);
  }

  @Query(() => Event, { name: 'event' })
  async findOne(@Args('findEventInput') { id = undefined, code = undefined }: FindEventInput) {
    if (!id && !code) throw new BadRequestException('Either "id" or "code" must be provided.');
    return id ? await this.eventService.findOneBy({ id }) : await this.eventService.findOneBy({ code });
  }

  // @Mutation(() => Event, { name: 'uploadImage' })
  // async uploadImage(@Args('uploadEventImageInput') uploadData: UploadEventImageInput, @CurrentUser() user: User) {
  //   return await this.eventService.uploadImage(uploadData, user);
  // }

  @Mutation(() => Event)
  updateEvent(@Args('updateEventInput') updateEventInput: UpdateEventInput) {
    return this.eventService.update(updateEventInput.id, updateEventInput);
  }

  @Mutation(() => Event)
  removeEvent(@Args('id') id: string) {
    return this.eventService.remove(id);
  }

  @ResolveField(() => PaginatedEventGuests, { name: 'guests' })
  async guests(@Args('paginationInput', { nullable: true }) paginationInput: PaginationInput, @Parent() event: Event) {
    return await this.eventService.resolveGuests(paginationInput, event.id);
  }
}
