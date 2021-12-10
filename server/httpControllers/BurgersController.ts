import { Request, Response } from 'express';
import { IController } from '../types';
import mongoose, { Schema } from 'mongoose';

const BurgerSchema = new Schema({
  title: String,
  price: Number,
});

export class BurgerController implements IController {
  public async get(req: Request, res: Response) {
    const Burger = mongoose.model('Burger', BurgerSchema);

    console.log('Get burger');
    Burger.find({})
      .then(result => {
        res.json(result || []);
      })
      .catch(e => res.json([]));
  }

  public post(req: Request, res: Response) {
    const Burger = mongoose.model('Burger', BurgerSchema);

    const burger = new Burger({ title: req.body.title, price: req.body.price });

    burger.save().then((r: any) => {
      res.send({ value: r || [] });
    });
  }
}
