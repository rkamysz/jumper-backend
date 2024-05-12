import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';

import { OpenApiDocumentBuilder } from '@/api-docs/open-api.generator';

import { Route } from './types';

export class ExpressRouter {
  private documentation = new OpenApiDocumentBuilder();
  constructor(
    private app: Express,
    private version: string
  ) {}

  private buildUrl(path: string) {
    const cleanedVersion = this.version ? this.version.replace(/^\/|\/$/g, '') : '';
    const cleanedPath = path.replace(/^\/|\/$/g, '');

    if (cleanedVersion.length > 0) {
      return `/${cleanedVersion}/${cleanedPath}`;
    } else {
      return `/${cleanedPath}`;
    }
  }

  mount(...routes: Route[]) {
    if (Array.isArray(routes)) {
      routes.forEach((route) => {
        const { path, middlewares, method, handler, registry } = route;
        if (method === 'get') {
          this.app.get(this.buildUrl(path), middlewares, handler);
        } else if (method === 'post') {
          this.app.post(this.buildUrl(path), middlewares, handler);
        }
        // rest ...
        if (registry) {
          this.documentation.addRegistry(registry);
        }
      });
    }
  }

  buildDocumentation(path: string) {
    const url = this.buildUrl(path);
    const docs = this.documentation.build(url);
    this.app.get(url, swaggerUi.serve, swaggerUi.setup(docs));
  }
}
