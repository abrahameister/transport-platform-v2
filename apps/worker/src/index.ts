import http from 'http';
import { logger } from '@transport-platform/observability';

const PORT = Number(process.env.PORT) || 3001;

export function createHealthServer() {
  return http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', service: 'worker' }));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'not_found' }));
    }
  });
}

if (process.env.NODE_ENV !== 'test') {
  logger.info('Starting worker process...', { port: PORT });

  const server = createHealthServer();

  server.listen(PORT, () => {
    logger.info('Worker health server listening', { port: PORT });
  });

  const shutdown = (signal: string) => {
    logger.info(`Received ${signal}, shutting down gracefully...`);
    server.close(() => {
      logger.info('Worker server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}
