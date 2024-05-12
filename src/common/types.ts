import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import * as pino from 'pino';

export type AnyFunction<T = void | Promise<void>> = (...args: any[]) => T;
export type Middleware<T = void | Promise<void>> = () => T;
export interface Route {
  path: string;
  method: string;
  registry: OpenAPIRegistry;
  middlewares: AnyFunction[];
  handler: AnyFunction;
}

export interface Server<T> {
  app: T;
  start: () => void;
}

// We should have some wrapper/service for the logger (in this case we just point to pino logger)
export type Logger = pino.Logger;
