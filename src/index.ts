import 'reflect-metadata';
import { initializeDb } from './component/db';
import { initializeHttpServer } from './component/http';
import { initializeWebSocket } from './component/socket';

(async () => {
  await initializeDb();
  const server = await initializeHttpServer();
  await initializeWebSocket(server);
})().catch(error => {
  console.error(`Failed to start server, exit`, error);
  process.exit(1);
});

