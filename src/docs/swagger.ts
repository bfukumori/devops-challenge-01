import { SwaggerOptions } from '@fastify/swagger';

export const swaggerOptions: SwaggerOptions = {
  openapi: {
    openapi: '3.0.0',
    info: {
      title: 'Challenge-01 API',
      description: 'Testing the Fastify Swagger API',
      version: '0.1.0',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    tags: [{ name: 'user', description: 'User related end-points' }],
  },
};
