FROM node:24-alpine AS build
WORKDIR /app

COPY package*.json /app
RUN npm ci --no-fund

COPY . /app
RUN npm run build

RUN npm prune --omit=dev


FROM node:24-alpine AS runner
WORKDIR /app

COPY --from=build /app/dist /app/dist

COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/package.json /app/package-lock.json /app/tsconfig.json /app/

RUN adduser -D -u 1111 -G node -s /sbin/nologin appuser

RUN chown -R appuser:node /app

USER appuser

ENV NODE_ENV=production
ENTRYPOINT ["node", "/app/dist/index.js"]
