import 'reflect-metadata';
import { initializeDb } from './component/db';
import { initializeHttpServer } from './component/http';
import { initializeWebSocket } from './component/socket';
import { startup } from './component/renderer';
import { ENABLE_RENDERER } from './component/constant';

(async () => {
  await initializeDb();
  const server = await initializeHttpServer();
  await initializeWebSocket(server);
  if (ENABLE_RENDERER) {
    startup();
  }
})().catch(error => {
  console.error(`Failed to start server, exit`, error);
  process.exit(1);
});

