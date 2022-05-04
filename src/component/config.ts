import * as fs from 'fs';
import * as path from 'path';

interface Config {
  db: {
    url: string;
    schema: string;
  };
  token: {
    expireIn: number;
  };
}

export const config = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../resource/config.json'), 'utf8')) as Config;
export const privateKey = fs.readFileSync(path.resolve(__dirname, '../resource/private-key.pem'), 'utf8');
export const publicKey = fs.readFileSync(path.resolve(__dirname, '../resource/public-key.pem'), 'utf8');
