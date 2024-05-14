import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { Container } from 'inversify';
import { z } from 'zod';

import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { authenticateAddressMiddleware } from '@/common/middleware/authenticate-address.middleware';
import { AnyFunction, Route } from '@/common/types';
import { AccountController } from '@/features';

import { createAccountHandler } from './create-account.handler';

export class CreateAccountRoute implements Route {
  static create(container: Container) {
    const path = '/account/create';
    const tags = ['Create Account'];
    const method = 'post';
    const registry = new OpenAPIRegistry();
    const controller = container.get<AccountController>(AccountController.Token);

    registry.registerPath({
      method,
      path,
      tags,
      responses: createApiResponse(z.null(), 'Success'),
    });

    return new CreateAccountRoute(path, method, createAccountHandler(controller), registry, [
      authenticateAddressMiddleware,
    ]);
  }

  constructor(
    public readonly path: string,
    public readonly method: 'get' | 'post',
    public readonly handler: AnyFunction,
    public readonly registry: OpenAPIRegistry,
    public readonly middlewares: AnyFunction[]
  ) {}
}
