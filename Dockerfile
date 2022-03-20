# Build
FROM node:14-alpine as build

RUN apk add --no-cache git

WORKDIR /node-app

COPY package.json /node-app
COPY package-lock.json /node-app

# Configure git, Install all dependencies.
RUN npm config set unsafe-perm true && \
    npm ci && \
    npm config set unsafe-perm false

COPY src /node-app/src
COPY tsconfig.json /node-app/tsconfig.json

RUN npm run build

# Deployment
FROM node:14-alpine

WORKDIR /node-app

# COPY dependencies and code from build
COPY --from=build /node-app /node-app

ENV NODE_ENV=production
CMD [ "node", "dist/index.js" ]
