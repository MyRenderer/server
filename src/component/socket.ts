import * as Http from 'http';
import { Pool } from 'pg';
import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/postgres-adapter';
import { MessageData, MessageType } from './types';
import { config } from './config';

let io: Server;

function projectNamespace(projectId: string): string {
  return `/projects/${projectId}`;
}

export async function initializeWebSocket(server: Http.Server): Promise<void> {
  io = new Server(server);

  // use pg adapter
  const pool = new Pool({ connectionString: config.db.url });
  await pool.query(`SET search_path TO ${config.db.schema};`)
  io.adapter(createAdapter(pool));

  // create dynamic namespace
  io.of(/^\/projects\/[^/]+$/);
}

export function notifyAll(projectId: string, type: MessageType, data: MessageData): void {
  io.of(projectNamespace(projectId)).emit(type, data);
}
