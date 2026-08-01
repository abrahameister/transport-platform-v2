import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import http from 'http';
import { createHealthServer } from './index';

describe('Worker Health Server', () => {
  let server: http.Server;
  const testPort = 3099;

  beforeAll(() => {
    return new Promise<void>((resolve) => {
      server = createHealthServer();
      server.listen(testPort, () => resolve());
    });
  });

  afterAll(() => {
    return new Promise<void>((resolve) => {
      server.close(() => resolve());
    });
  });

  it('responds with 200 ok to GET /health', async () => {
    const res = await new Promise<{ status: number; body: { status: string; service: string } }>((resolve, reject) => {
      http
        .get(`http://127.0.0.1:${testPort}/health`, (response) => {
          let data = '';
          response.on('data', (chunk) => (data += chunk));
          response.on('end', () => {
            resolve({
              status: response.statusCode || 500,
              body: JSON.parse(data),
            });
          });
        })
        .on('error', reject);
    });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toBe('worker');
  });

  it('responds with 404 to unknown routes', async () => {
    const res = await new Promise<{ status: number }>((resolve, reject) => {
      http
        .get(`http://127.0.0.1:${testPort}/unknown`, (response) => {
          resolve({ status: response.statusCode || 500 });
        })
        .on('error', reject);
    });

    expect(res.status).toBe(404);
  });
});
