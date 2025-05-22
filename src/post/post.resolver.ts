import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { PostService } from './post.service';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@app/guards';
import { CurrentUser } from '@app/decorators';
import { Post, User } from '@app/entities';
import { FindAllPostsInput } from './dto/find-all-posts-input.dto';
import { PaginatedPostResponse } from './dto/paginated-post-response.dto';

@Resolver(() => Post)
@UseGuards(AuthGuard)
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  @Mutation(() => Post)
  createPost(@Args('createPostInput') createPostInput: CreatePostInput, @CurrentUser() user: User) {
    console.log('🚀 ~ PostResolver ~ createPost ~ createPostInput:', createPostInput);
    return this.postService.create(createPostInput, user);
  }

  @Query(() => PaginatedPostResponse, { name: 'posts' })
  findAll(@Args('findAllPostInput') { weddingId, ...pagination }: FindAllPostsInput) {
    return this.postService.findAll(weddingId, pagination);
  }

  @Query(() => Post, { name: 'post' })
  findOne(@Args('id') id: string) {
    return this.postService.findOne(id);
  }

  @Mutation(() => Post)
  updatePost(@Args('updatePostInput') updatePostInput: UpdatePostInput) {
    return this.postService.update(updatePostInput.id, updatePostInput);
  }

  @Mutation(() => Post)
  removePost(@Args('id') id: string) {
    return this.postService.remove(id);
  }
}
