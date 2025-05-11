import { ClientType } from '@app/types';
import { getClientType } from '@app/utils';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';

export const ClientSource = createParamDecorator((_: any, context: ExecutionContext): ClientType => {
  const ctx = GqlExecutionContext.create(context);
  const req = ctx.getContext().req as Request;
  return getClientType(req);
});
