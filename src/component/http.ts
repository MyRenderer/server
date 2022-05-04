import * as path from 'path';
import { createServer, Server } from 'http';
import * as express from 'express';
import * as cors from 'cors';
import * as jwt from 'jsonwebtoken';
import { Action, ForbiddenError, UnauthorizedError, useExpressServer } from 'routing-controllers';
import { APPLICATION_NAME, PORT } from './constant';
import { publicKey } from './config';

export interface AuthorizedUser {
  id: string;
  name: string;
  roles: string[];
  owner: string;
}

export interface JwtPayload {
  sub: string;
  name: string;
  exp: number;
  roles: string[];
}

const requestLogger = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.info(`Receiving ${req.method} request ${req.path}`);
  next();
};

const INTERNAL_USERS = ['root_user'];

function authorizationChecker(publicKey: string) {
  return async (action: Action, roles: string[]): Promise<boolean> => {
    let token: string | undefined = action.request.headers['authorization'];
    if (!token || !/^Bearer\s/i.test(token)) {
      throw new UnauthorizedError('token is empty');
    }
    token = token.replace(/^Bearer\s/i, '');
    return new Promise((resolve, reject) => {
      jwt.verify(token as string, publicKey, async (error, decoded) => {
        if (error) {
          console.error(`Failed to verify token: ${error}`);
          reject(new UnauthorizedError(error.message));
        } else {
          const payload = decoded as JwtPayload;
          if (roles.length && roles.every(r => !payload.roles.includes(r))) {
            reject(new ForbiddenError());
          } else {
            resolve(true);
          }
        }
      });
    });
  }
}

function currentUserChecker() {
  return async (action: Action): Promise<AuthorizedUser> => {
    let token: string | undefined = action.request.headers['authorization'];
    if (!token || !/^Bearer\s/i.test(token)) {
      throw new Error('Token not found');
    }
    token = token.replace(/^Bearer\s/i, '');
    const payload = jwt.decode(token as string) as JwtPayload;
    const owner = (payload.roles.some(r => INTERNAL_USERS.includes(r)) && action.request.headers['x-owner']) || payload.sub;
    return {
      id: payload.sub,
      name: payload.name,
      roles: payload.roles,
      owner: owner,
    };
  }
}

export async function initializeHttpServer(): Promise<Server> {
  const app = express();
  app.use(express.json());
  app.use(cors());
  app.use(requestLogger);

  // health check
  app.get('/', (req: express.Request, res: express.Response) => {
    res.status(200).json({ application: APPLICATION_NAME });
  });

  // use routing-controllers
  const server = createServer(useExpressServer(app, {
    controllers: [path.resolve(__dirname, '../controller/*.js')],
    authorizationChecker: authorizationChecker(publicKey),
    currentUserChecker: currentUserChecker(),
    defaultErrorHandler: false,
  }));

  return new Promise((resolve => {
    server.listen(PORT, () => {
      console.log(`Http server is running on http://localhost:${PORT}`);
      resolve(server);
    });
  }));
}
