import { DatabaseModule } from '@app/database';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { forwardRef, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { UserModule } from './user/user.module';
import { GuestModule } from './guest/guest.module';
import { MediaModule } from './media/media.module';
import { AlbumModule } from './album/album.module';
import { AuthModule } from './auth/auth.module';
import { RequestProcessorMiddleware } from '@app/middlewares';
import { graphqlUploadExpress } from 'graphql-upload-ts';
import { FileStorageModule } from './file-storage/file-storage.module';
import { PostModule } from './post/post.module';
import { TokenService } from './token/token.service';
import { EventModule } from './event/event.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    DatabaseModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      csrfPrevention: false,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      installSubscriptionHandlers: true,
      sortSchema: true,
      graphiql: true,
      subscriptions: { 'graphql-ws': true, 'subscriptions-transport-ws': true },
    }),
    forwardRef(() => UserModule),
    forwardRef(() => EventModule),
    forwardRef(() => GuestModule),
    forwardRef(() => MediaModule),
    forwardRef(() => AlbumModule),
    forwardRef(() => AuthModule),
    forwardRef(() => FileStorageModule),
    forwardRef(() => PostModule),
  ],
  providers: [TokenService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestProcessorMiddleware).forRoutes('graphql');
    consumer.apply(graphqlUploadExpress()).forRoutes('graphql');
  }
}
