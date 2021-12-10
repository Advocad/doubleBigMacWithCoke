import { Request, Response } from 'express';
import { generateToken } from '../model/token';
import { IController } from '../types';

export class TokenController implements IController {
  public get(req: Request, res: Response) {
    res.send(
      generateToken({
        channel: req.body.channel,
        isPublisher: req.body.isPublisher,
      })
    );
  }
}
