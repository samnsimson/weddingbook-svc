import { ClientType } from '@app/types';
import { BadRequestException } from '@nestjs/common';
import { isArray } from 'class-validator';
import { Request } from 'express';

export const generateCode = (): number => {
  return Math.floor(100000 + Math.random() * 900000);
};

export function getClientType(req: Request): ClientType {
  let clientHeader = req.headers['x-client-type'];
  if (!clientHeader) throw new BadRequestException('x-client-type header is missing');
  if (isArray(clientHeader)) clientHeader = clientHeader[0];
  if (clientHeader.toLowerCase() === 'app') return ClientType.APP;
  if (clientHeader.toLowerCase() === 'web') return ClientType.WEB;
  return ClientType.UNKNOWN;
}

export const exceptionFactory = (errors) => {
  return errors.reduce((acc: Record<string, any>, error) => {
    acc[error.property] = Object.values(error.constraints).join(', ');
    return acc;
  }, {});
};
