import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class RequestProcessorMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RequestProcessorMiddleware.name);
  use(req: Request, res: Response, next: NextFunction) {
    // const clientSource = getClientType(req);
    const operation = req.body.operationName || 'unknown';
    // this.logger.log(`Processing request from source: ${clientSource}`);
    this.logger.log(`Processing request for operation: ${operation}`);
    // if (clientSource === ClientType.UNKNOWN) throw new ForbiddenException('Client source is forbidden');
    next();
  }
}
