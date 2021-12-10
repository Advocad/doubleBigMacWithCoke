import { Request, Response } from 'express';
import { IController } from '../types';

export class ApiController implements IController {
  public get(req: Request, res: Response) {
    res.json({ message: 123 });
  }

  public post(req: Request, res: Response) {
    res.send({ value: req.body.value * 100 });
  }
}
