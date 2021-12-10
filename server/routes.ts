import { AppIdController, TokenController, ApiController } from './httpControllers';
import { IController, Class } from './types';

export function configureRoutes(
  registerRoute: (route: string, controller: Class<IController>) => void
) {
  registerRoute('/rtctoken', TokenController);
  registerRoute('/api', ApiController);
  registerRoute('/appid', AppIdController);
}
