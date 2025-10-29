import Koa from 'koa';
import json from 'koa-json';
import Logger from './lib/log';
import { config } from './config';
import health from './routes/health';
import * as ws from './clients/websocket';

const namespace = 'api';
const log = Logger.get(namespace);
const app = new Koa();
const port = config.api.port;

app.use(json());
app.use(health.routes()).use(health.allowedMethods());

app.listen(port, () => {
  log.notice(`API server started on port ${port}`);
});

ws.connect();
