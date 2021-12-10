import express, { Express } from 'express';
import { Server } from 'socket.io';

import { configureRoutes } from './routes';
import { IController, Class } from './types';

export function registerSocket(io: Server) {
  io.on('connection', s => {
    s.on('test', d => {
      console.log(d);
    });
    console.log('Socket connectied');
    s.send({ value: '123123' });
  });
}

export function registerMiddleware(app: Express) {
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
