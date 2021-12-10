import { AppIdController, TokenController, ApiController } from './httpControllers';
import { BurgerController } from './httpControllers/BurgersController';
import { IController, Class } from './types';

export function configureRoutes(
  registerRoute: (route: string, controller: Class<IController>) => void
) {
  registerRoute('/rtctoken', TokenController);
  registerRoute('/api', ApiController);
  registerRoute('/appid', AppIdController);
  registerRoute('/burger', BurgerController);
}
