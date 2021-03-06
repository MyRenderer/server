export const APPLICATION_NAME = 'server';

export const PORT = Number(process.env.PORT || '8080');

export const LOG_LEVEL = process.env.LOG_LEVEL || 'debug';

export const ENABLE_RENDERER = process.env.ENABLE_RENDERER === 'true';
