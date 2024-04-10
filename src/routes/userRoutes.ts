import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';

export async function userRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.post(
    '/users',
    {
      schema: {
        description: 'Route to create a user',
        tags: ['user'],
        summary: 'Create a user',
        body: {
          type: 'object',
          properties: {
            email: { type: 'string' },
            password: { type: 'string' },
            name: { type: 'string' },
          },
        },
        response: {
          201: {
            description: 'Successful response',
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const createUserBodySchema = z.object({
        email: z.string().email(),
        password: z.string().min(8),
        name: z.string().optional(),
      });

      const { password, email, name } = createUserBodySchema.parse(
        request.body
      );

      await prisma.user.create({
        data: {
          email,
          password,
          name,
        },
      });

      return reply.status(201).send({ message: 'User created' });
    }
  );

  fastify.get(
    '/users',
    {
      schema: {
        description: 'Route to list all users',
        tags: ['user'],
        summary: 'List users',
        response: {
          200: {
            description: 'Successful response',
            type: 'object',
            properties: {
              users: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'number' },
                    name: { type: 'string' },
                    email: { type: 'string' },
                    password: { type: 'string' },
                    role: {
                      type: 'string',
                      enum: ['USER', 'ADMIN'],
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    async (_, reply) => {
      const users = await prisma.user.findMany();

      return reply.send({ users });
    }
  );

  fastify.patch(
    '/users/:id',
    {
      schema: {
        description: 'Route to update a user',
        tags: ['user'],
        summary: 'Update a user',
        body: {
          type: 'object',
          properties: {
            email: { type: 'string' },
            password: { type: 'string' },
            name: { type: 'string' },
          },
        },
        response: {
          200: {
            description: 'Successful response',
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const updateUserBodySchema = z.object({
        email: z.string().email().optional(),
        password: z.string().min(8).optional(),
        name: z.string().optional(),
      });

      const updateUserParamsSchema = z.object({
        id: z.string(),
      });

      const { id } = updateUserParamsSchema.parse(request.params);
      const { password, email, name } = updateUserBodySchema.parse(
        request.body
      );

      await prisma.user.update({
        where: {
          id,
        },
        data: {
          email,
          password,
          name,
        },
      });

      return reply.status(200).send({ message: 'User updated' });
    }
  );

  fastify.delete(
    '/users/:id',
    {
      schema: {
        description: 'Route to delete a user',
        tags: ['user'],
        summary: 'Delete a user',
        response: {
          200: {
            description: 'Successful response',
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const deleteUserParamsSchema = z.object({
        id: z.string(),
      });

      const { id } = deleteUserParamsSchema.parse(request.params);

      await prisma.user.delete({
        where: {
          id,
        },
      });

      return reply.status(200).send({ message: 'User deleted' });
    }
  );
}
