import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { AnyFunction, Route } from '@/common/types';
import { handleServiceResponse } from '@/common/utils/httpHandlers';

export class HealthCheckRoute implements Route {
  static create() {
    const path = '/health-check';
    const tags = ['Health Check'];
    const method = 'get';
    const registry = new OpenAPIRegistry();

    registry.registerPath({
      method,
      path,
      tags,
      responses: createApiResponse(z.null(), 'Success'),
    });

    return new HealthCheckRoute(
      path,
      method,
      (_req: Request, res: Response) => {
        const serviceResponse = new ServiceResponse(ResponseStatus.Success, 'Service is healthy', null, StatusCodes.OK);
        handleServiceResponse(serviceResponse, res);
      },
      registry,
      []
    );
  }

  constructor(
    public readonly path: string,
    public readonly method: 'get' | 'post',
    public readonly handler: AnyFunction,
    public readonly registry: OpenAPIRegistry,
    public readonly middlewares: any[]
  ) {}
}
