import { IController, Class } from './types';

import * as controllers from './httpControllers';

export function configureRoutes(
  registerRoute: (route: string, controller: Class<IController>) => void
) {
  Object.values(controllers).forEach(allControllers => {
    console.log('Controller');
    const controller = allControllers;
    // @ts-ignore
    console.log(controller.__baseUrl)
    // @ts-ignore
    registerRoute(controller.__baseUrl, controller);
  });
}
