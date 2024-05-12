import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';

export type AnyFunction<T = void | Promise<void>> = (...args: any[]) => T;
// export type Middleware = AnyFunction<>;
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
