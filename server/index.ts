import express from 'express';
import { Server } from 'socket.io';
import http from 'http';

import { initDotEnv } from './utils';
import { getConfig, getDbConnectionString, getSocketConfig } from './config';
import { registerSocket, registerMiddleware, registerControllers } from './register';
import mongoose from 'mongoose';

function init() {
  initDotEnv();

  mongoose.connect(getDbConnectionString(getConfig().dbName));
  const app = express();
  const server = http.createServer(app);
  const io = new Server(server, getSocketConfig());

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
