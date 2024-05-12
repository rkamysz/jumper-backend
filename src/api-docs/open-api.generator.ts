import { OpenApiGeneratorV3, OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';

export class OpenApiDocumentBuilder {
  private list: OpenAPIRegistry[] = [];

  addRegistry(item: OpenAPIRegistry) {
    this.list.push(item);
  }

  build(url: string) {
    const { list } = this;
    const registry = new OpenAPIRegistry(list);

    return new OpenApiGeneratorV3(registry.definitions).generateDocument({
      openapi: '3.0.0',
      info: {
        version: '1.0.0',
        title: 'Swagger API',
      },
      externalDocs: {
        description: 'View the raw OpenAPI Specification in JSON format',
        url,
      },
    });
  }
}
