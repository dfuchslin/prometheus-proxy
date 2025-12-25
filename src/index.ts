import { startServer, stopServer } from './app.js';
import logger from './lib/logger.js';

Promise.all([startServer()])
  .catch(async (err) => {
    logger.error(err);
    await missionAbort(1);
  });

const missionAbort = async (signal = 0) => {
  stopServer();
  logger.warn('All stopped, exiting with signal', signal);
  process.exit(signal);
};

process.on('SIGINT', () => missionAbort(1));
process.on('SIGTERM', () => missionAbort(1));
process.on('SIGHUP', () => {
  logger.warn('received SIGHUP, not supported');
});
