import express, { Express } from 'express';
import { Server } from 'socket.io';
import { getConfig } from './config';

import { configureRoutes } from './routes';
import { IController, Class } from './types';

export function registerSocket(io: Server) {
  io.on('connection', s => {
    s.on('onvoice', d => {
      console.log('OnVoice', d);

      s.broadcast.emit('onvoice', d);
    });

    console.log('Socket connectied');
  });
}

export function registerMiddleware(app: Express) {
  getConfig().mode === 'production' && app.use('/', express.static('./client/build'));
  app.use(express.json());
}

export function registerControllers(app: Express) {
  const register = (route: string, Controller: Class<IController>) => {
    const controller = new Controller();

    controller.post && app.post(route, controller.post);
    controller.get && app.get(route, controller.get);
  };

  configureRoutes(register);
}
