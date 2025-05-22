import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { MediaService } from './media.service';
import { CreateMediaInput } from './dto/create-media.input';
import { UpdateMediaInput } from './dto/update-media.input';
import { Media, User } from '@app/entities';
import { CurrentUser } from '@app/decorators';
import { FindAllMediaInput } from './dto/fina-all-media.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@app/guards';

@Resolver(() => Media)
@UseGuards(AuthGuard)
export class MediaResolver {
  constructor(private readonly mediaService: MediaService) {}

  @Mutation(() => Media)
  createMedia(@Args('createMediaInput') createMediaInput: CreateMediaInput, @CurrentUser() user: User) {
    return this.mediaService.create(createMediaInput, user);
  }

  @Query(() => [Media], { name: 'medias' })
  findAll(@Args('findAllMediaInput') { weddingId, ...pagination }: FindAllMediaInput) {
    return this.mediaService.findAll(weddingId, pagination);
  }

  @Query(() => Media, { name: 'media' })
  findOne(@Args('id', { type: () => Int }) id: string) {
    return this.mediaService.findOne(id);
  }

  @Mutation(() => Media)
  updateMedia(@Args('updateMediaInput') updateMediaInput: UpdateMediaInput) {
    return this.mediaService.update(updateMediaInput.id, updateMediaInput);
  }

  @Mutation(() => Media)
  removeMedia(@Args('id', { type: () => Int }) id: string) {
    return this.mediaService.remove(id);
  }
}
