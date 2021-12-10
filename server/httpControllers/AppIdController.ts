import { Request, Response } from 'express';
import { IController } from '../types';

export class AppIdController implements IController {
  public get(req: Request, res: Response) {
    res.json({ appID: process.env.APP_ID });
  }
}
