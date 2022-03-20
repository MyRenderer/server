import * as path from 'path';
import { Connection, createConnection, EntityTarget, Repository } from 'typeorm';
import { config } from './config';
import { LOG_LEVEL } from './constant';

let connection: Connection;

export async function initializeDb(): Promise<void> {
  connection = await createConnection({
    type: 'postgres',
    synchronize: false,
    url: config.db.url,
    schema: config.db.schema,
    logging: LOG_LEVEL === 'debug',
    cache: false,
    entities: [
      `${path.resolve(__dirname, '../entity')}/**.{js,ts}`
    ],
    migrations: [
      `${path.resolve(__dirname, '../migration')}/**.{js,ts}`
    ]
  });
  await connection.createQueryRunner().createSchema(config.db.schema, true);
  await connection.runMigrations();
}

export function getRepository<T>(entityClass: EntityTarget<T>): Repository<T> {
  return connection.getRepository(entityClass);
}
