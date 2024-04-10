import { fastify } from './lib/fastify.js';
import { env } from './env/index.js';
import { userRoutes } from './routes/userRoutes.js';
import { swaggerOptions } from './docs/swagger.js';
import { swaggerUiOptions } from './docs/swagger-ui.js';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';

fastify.register(fastifySwagger, swaggerOptions);

fastify.register(fastifySwaggerUi, swaggerUiOptions);

fastify.register(userRoutes);

const start = async () => {
  try {
    await fastify.listen({ host: '0.0.0.0', port: env.PORT });
    await fastify.ready();
    fastify.swagger();
    console.log(`Server listening on port ${env.PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
