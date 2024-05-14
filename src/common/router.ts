import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';

import { OpenApiDocumentBuilder } from '@/api-docs/open-api.generator';

import { Route } from './types';

/**
 * Class to handle mounting routes and building API documentation for an Express application.
 */
export class ExpressRouter {
  private documentation = new OpenApiDocumentBuilder();

  /**
   * Creates an instance of ExpressRouter.
   *
   * @param {Express} app - The Express application instance.
   * @param {string} version - The version of the API.
   */
  constructor(
    private app: Express,
    private version: string
  ) {}

  /**
   * Builds a full URL by combining the API version and the path.
   *
   * @param {string} path - The path to append to the API version.
   * @returns {string} The full URL.
   */
  private buildUrl(path: string) {
    const cleanedVersion = this.version ? this.version.replace(/^\/|\/$/g, '') : '';
    const cleanedPath = path.replace(/^\/|\/$/g, '');

    if (cleanedVersion.length > 0) {
      return `/${cleanedVersion}/${cleanedPath}`;
    } else {
      return `/${cleanedPath}`;
    }
  }

  /**
   * Mounts an array of routes to the Express application.
   *
   * @param {...Route[]} routes - The routes to mount.
   */
  mount(...routes: Route[]) {
    if (Array.isArray(routes)) {
      routes.forEach((route) => {
        if (route) {
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
        }
      });
    }
  }

  /**
   * Builds and mounts API documentation using Swagger UI.
   *
   * @param {string} path - The path to serve the API documentation.
   */
  buildDocumentation(path: string) {
    const url = this.buildUrl(path);
    const docs = this.documentation.build(url);
    this.app.get(url, swaggerUi.serve, swaggerUi.setup(docs));
  }
}
