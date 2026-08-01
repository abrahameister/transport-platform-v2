import http from 'http';
import { createLogger } from '@transport-platform/observability';
import { createAdminClient } from '@transport-platform/supabase/admin';

const logger = createLogger('worker');

export function createHealthServer(): http.Server {
  // Verify Supabase Admin Client can be instantiated in Node.js
  const supabaseUrl = process.env.SUPABASE_URL || 'http://127.0.0.1:54321';
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY || 'sb_secret_placeholder_local';

  try {
    const adminClient = createAdminClient({ url: supabaseUrl, adminKey: supabaseSecretKey });
    if (adminClient) {
      logger.info('Supabase Admin Client successfully initialized in worker process');
    }
  } catch (err) {
    logger.warn('Supabase Admin Client initialization warning during startup', { error: String(err) });
  }

  const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', service: 'worker' }));
      return;
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
  });

  return server;
}

if (process.env.NODE_ENV !== 'test') {
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
  const server = createHealthServer();

  server.listen(port, () => {
    logger.info(`Worker service running on port ${port}`);
  });

  const gracefulShutdown = (signal: string) => {
    logger.info(`Received ${signal}. Shutting down worker gracefully...`);
    server.close(() => {
      logger.info('Worker server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
}
