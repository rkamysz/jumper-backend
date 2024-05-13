import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import * as pino from 'pino';

export type AnyObject = { [key: string]: unknown };
export type AnyFunction<T = any> = (...args: any[]) => T;
export type Middleware<T = any> = () => T;
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
