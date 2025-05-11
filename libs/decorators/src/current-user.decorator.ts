import { User } from '@app/entities';
import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator((data: keyof User | undefined, context: ExecutionContext) => {
  const ctx = GqlExecutionContext.create(context);
  const user = ctx.getContext().req.user as User | undefined;
  if (!user) throw new UnauthorizedException('Unauthorized');
  return data ? user[data] : user;
});
