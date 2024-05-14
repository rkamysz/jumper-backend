import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import { describe, expect, it, Mock, vi } from 'vitest';

import { OpenApiDocumentBuilder } from '@/api-docs/open-api.generator';

import { ExpressRouter } from '../router';
import { Route } from '../types';

vi.mock('express');
vi.mock('swagger-ui-express');
vi.mock('@/api-docs/open-api.generator');

describe('ExpressRouter', () => {
  let app: Express;
  let router: ExpressRouter;
  let addRegistryMock: Mock;
  let buildMock: Mock;

  beforeEach(() => {
    app = {
      get: vi.fn(),
      post: vi.fn(),
    } as unknown as Express;

    addRegistryMock = vi.fn();
    buildMock = vi.fn().mockReturnValue({});

    (OpenApiDocumentBuilder as Mock).mockImplementation(() => ({
      addRegistry: addRegistryMock,
      build: buildMock,
    }));

    router = new ExpressRouter(app, 'v1');
  });

  describe('buildUrl', () => {
    it('should build URL with version and path', () => {
      const url = router['buildUrl']('test/path');
      expect(url).toBe('/v1/test/path');
    });

    it('should build URL without version if version is empty', () => {
      const routerWithoutVersion = new ExpressRouter(app, '');
      const url = routerWithoutVersion['buildUrl']('test/path');
      expect(url).toBe('/test/path');
    });
  });

  describe('mount', () => {
    it('should mount routes with GET method', () => {
      const route: Route = {
        path: 'test',
        middlewares: [],
        method: 'get',
        handler: vi.fn(),
        registry: {} as any,
      };

      router.mount(route);

      expect(app.get).toHaveBeenCalledWith('/v1/test', [], route.handler);
      expect(addRegistryMock).toHaveBeenCalledWith(route.registry);
    });

    it('should mount routes with POST method', () => {
      const route: Route = {
        path: 'test',
        middlewares: [],
        method: 'post',
        handler: vi.fn(),
        registry: {} as any,
      };

      router.mount(route);

      expect(app.post).toHaveBeenCalledWith('/v1/test', [], route.handler);
      expect(addRegistryMock).toHaveBeenCalledWith(route.registry);
    });

    it('should not mount routes if routes is not an array', () => {
      router.mount(undefined as unknown as Route);
      expect(app.get).not.toHaveBeenCalled();
      expect(app.post).not.toHaveBeenCalled();
    });
  });

  describe('buildDocumentation', () => {
    it('should build and mount documentation', () => {
      router.buildDocumentation('docs');

      expect(buildMock).toHaveBeenCalledWith('/v1/docs');
      expect(app.get).toHaveBeenCalledWith('/v1/docs', swaggerUi.serve, swaggerUi.setup({}));
    });
  });
});
