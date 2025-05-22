import { DatabaseModule } from '@app/database';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { forwardRef, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { UserModule } from './user/user.module';
import { WeddingModule } from './wedding/wedding.module';
import { GuestModule } from './guest/guest.module';
import { MediaModule } from './media/media.module';
import { AlbumModule } from './album/album.module';
import { AuthModule } from './auth/auth.module';
import { RequestProcessorMiddleware } from '@app/middlewares';
import { graphqlUploadExpress } from 'graphql-upload-ts';
import { FileStorageModule } from './file-storage/file-storage.module';
import { PostModule } from './post/post.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    DatabaseModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      csrfPrevention: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      graphiql: true,
    }),
    forwardRef(() => UserModule),
    forwardRef(() => WeddingModule),
    forwardRef(() => GuestModule),
    forwardRef(() => MediaModule),
    forwardRef(() => AlbumModule),
    forwardRef(() => AuthModule),
    FileStorageModule,
    PostModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestProcessorMiddleware).forRoutes('graphql');
    consumer.apply(graphqlUploadExpress()).forRoutes('graphql');
  }
}
