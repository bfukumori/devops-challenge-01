FROM node:20-alpine3.19 AS build

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma

RUN npm install

COPY . .

RUN npm run build
RUN npm install --production

FROM node:20-alpine3.19

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/package.json ./package.json
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/prisma ./prisma
COPY --from=build /usr/src/app/node_modules/@fastify/swagger-ui/static /docs/static

EXPOSE 3000

CMD ["npm","run", "start:migrate:prod"]
