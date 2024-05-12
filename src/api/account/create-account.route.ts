import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { AnyFunction, Route } from '@/common/types';

export class CreateAccountRoute implements Route {
  static create(handler: AnyFunction) {
    const path = '/account/create';
    const tags = ['Create Account'];
    const method = 'post';
    const registry = new OpenAPIRegistry();

    registry.registerPath({
      method,
      path,
      tags,
      responses: createApiResponse(z.null(), 'Success'),
    });

    return new CreateAccountRoute(path, method, handler, registry, []);
  }

  constructor(
    public readonly path: string,
    public readonly method: 'get' | 'post',
    public readonly handler: AnyFunction,
    public readonly registry: OpenAPIRegistry,
    public readonly middlewares: any[]
  ) {}
}
