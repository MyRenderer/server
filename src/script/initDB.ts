import { createConnection } from 'typeorm';
import { hash } from '../component/util';

const dbHost = process.env.DB_HOST;
const dbPort = Number(process.env.DB_PORT || '5432');
const dbName = process.env.DB_NAME || 'myrenderer';
const dbSchema = process.env.DB_SCHEMA || 'server';
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const rootPassword = process.env.ROOT_PASSWORD;

if (!dbHost || !dbUser || !dbPassword || !rootPassword) {
  console.error(`env DB_HOST, DB_USER, DB_PASSWORD or ROOT_PASSWORD can't be empty`);
  process.exit(1);
}

(async () => {
  const connection = await createConnection({
    type: 'postgres',
    synchronize: false,
    host: dbHost,
    port: dbPort,
    username: dbUser,
    password: dbPassword,
    database: dbName,
    schema: dbSchema,
    logging: true,
  });
  await connection.createQueryRunner().query(
    `INSERT INTO "${dbSchema}"."user" ("id", "username", "password") VALUES ('30b98800-5460-4165-8507-cbe358bb0743', 'root', '${await hash(rootPassword)}')`
  );
  await connection.createQueryRunner().query(
    `INSERT INTO "${dbSchema}"."role" ("name", "userId") VALUES ('root_user','30b98800-5460-4165-8507-cbe358bb0743')`
  );

})().catch(error => {
  console.error(error);
});
