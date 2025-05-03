import { ArgumentsHost, BadRequestException, Catch, ConflictException, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';

@Catch(EntityNotFoundError)
export class EntityNotFoundExceptionFilter implements GqlExceptionFilter {
  private readonly logger = new Logger(EntityNotFoundExceptionFilter.name);
  catch(exception: EntityNotFoundError, host: ArgumentsHost) {
    GqlArgumentsHost.create(host);
    this.logger.error(exception.message);
    return new NotFoundException('Entity not found');
  }
}

@Catch(QueryFailedError)
export class QueryFailedExceptionFilter implements GqlExceptionFilter {
  private readonly logger = new Logger(QueryFailedExceptionFilter.name);
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    GqlArgumentsHost.create(host);
    const errorCode = (exception as any).driverError?.code;
    const message = (exception as any).driverError?.message;
    this.logger.error(`[${errorCode}]: ${message}`);
    this.logger.error(`[${errorCode}]: ${exception.query}`);
    if (errorCode) {
      switch (errorCode) {
        case '23505':
          return new ConflictException(`[DUPLICATE ENTRY]: ${message}`);
        case '23503':
          return new ConflictException(`[REFERENCE ERROR]: ${message}`);
        case '22P02':
          return new ConflictException(`[INVALID DATA FORMAT]: ${message}`);
        case '42703':
          return new BadRequestException(`[INVALID FIELD]: ${message}`);
        case '42P01':
          return new InternalServerErrorException(`[TABLE NOT FOUND]: ${message}`);
        case '23502':
          return new BadRequestException(`[MISSING REQUIRED FIELD]: ${message}`);
        case '42601':
          return new BadRequestException(`[SYNTAX ERROR]: ${message}`);
        case '42883':
          return new InternalServerErrorException(`[FUNCTION NOT FOUND]: ${message}`);
        case '40001':
          return new ConflictException(`[SERIALIZATION FAILURE]: ${message}`);
      }
    }
  }
}
