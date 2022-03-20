import * as fs from 'fs';
import * as path from 'path';

interface Config {
  db: {
    url: string;
    schema: string;
  };
}

export const config = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../resource/config.json'), 'utf8')) as Config;
