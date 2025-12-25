
// import * as ws from './clients/websocket';

// ws.connect();

import { serve, type ServerType } from '@hono/node-server';
import { logger as honoLogger } from 'hono/logger';
import { compress } from 'hono/compress';
import logger from './lib/logger.js';
import { config } from './config.js';
import health from './routes/health.js';
import { Hono } from 'hono';
import { prometheus } from '@hono/prometheus';

const app = new Hono();

const { printMetrics, registerMetrics } = prometheus();

app.use('*', registerMetrics);
app.use(compress());
app.use(honoLogger());

app.route('/', health);
app.get('/metrics', printMetrics);

let server: ServerType | null;

export const startServer = () => {
  server = serve(
    {
      fetch: app.fetch,
      port: config.api.port,
    },
    (info) => {
      logger.info(`Listening on port ${info.port}`);
    },
  );
};

export const stopServer = () => {
  if (server) {
    server.close();
    server = null;
    logger.info('Server shut down');
  }
};
