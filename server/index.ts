import express from 'express';
import { Server, ServerOptions } from 'socket.io';
import http from 'http';

import { initDotEnv } from './utils';
import { getConfig } from './config';
import { registerSocket, registerMiddleware, registerControllers } from './register';

function getExpressServerConfig(): Partial<ServerOptions> {
  return {};
}

function init() {
  initDotEnv();

  const app = express();
  const server = http.createServer(app);
  const io = new Server(server, getExpressServerConfig());

  registerMiddleware(app);
  registerControllers(app);
  registerSocket(io);

  return server;
}

function run() {
  const { port } = getConfig();
  const server = init();

  server.listen(port, () => {
    console.log(`Server listening on ${port}`);
  });
}

run();
