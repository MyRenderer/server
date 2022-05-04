import * as crypto from 'crypto';
import { User } from '../entity/user';
import { config, privateKey } from './config';
import { JwtPayload } from './http';
import * as jwt from 'jsonwebtoken';

export async function verify(password: string, hash: string): Promise<boolean> {
  if (!password) {
    return !hash;
  }
  return new Promise((resolve, reject) => {
    const [salt, key] = hash.split(':');
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(key === derivedKey.toString('hex'));
    });
  });
}

export function generateToken(user: User): string {
  const userId = user.id;
  const expireIn = config.token.expireIn;
  const roles = user.roles.map(r => r.name);
  const payload: JwtPayload = {
    sub: userId,
    name: user.username,
    exp: Math.trunc(Date.now() / 1000) + expireIn,
    roles: roles
  };
  return jwt.sign(payload, privateKey, { algorithm: 'RS256' });
}

export async function hash(password: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    // generate random 16 bytes long salt
    const salt = crypto.randomBytes(16).toString('hex');
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(salt + ':' + derivedKey.toString('hex'));
    });
  });
}
