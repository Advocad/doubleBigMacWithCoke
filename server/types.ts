import { Request, Response, NextFunction } from 'express';

export type Class<I, Args extends any[] = any[]> = new (...args: Args) => I;

export type IController = {
  post?: (req: Request, res: Response, next: NextFunction) => void;
  get?: (req: Request, res: Response, next: NextFunction) => void;
};
