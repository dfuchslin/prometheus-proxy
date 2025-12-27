FROM node:24-alpine AS build
WORKDIR /app

COPY package*.json /app
# Do NOT ignore scripts so native modules and Prisma engines get built/downloaded
RUN npm ci --no-fund

COPY . /app
RUN npm run build

# Prune dev dependencies but keep built native addons and Prisma engines
RUN npm prune --omit=dev


FROM node:24-alpine AS runner
WORKDIR /app

COPY --from=build /app/dist /app/dist

# Use the already-built node_modules from the build stage to preserve native addons
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/package.json /app/package-lock.json /app/tsconfig.json /app/

# Create group and user
RUN adduser -D -u 1111 -G node -s /sbin/nologin appuser

# Change ownership of the app directory to appuser
RUN chown -R appuser:node /app

# Switch to the new user
USER appuser

ENTRYPOINT ["node", "/app/dist/index.js"]
