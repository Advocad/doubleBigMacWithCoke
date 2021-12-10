import { Request, Response } from 'express';
import { IController } from '../types';
import mongoose, { Schema } from 'mongoose';

const CatSchema = new Schema({
  title: String,
});

export class ApiController implements IController {
  public async get(req: Request, res: Response) {
    const Cat = mongoose.model('Cat', CatSchema);
    const result = await Cat.find({});

    res.json(result);
  }

  public post(req: Request, res: Response) {
    const Cat = mongoose.model('Cat', CatSchema);
    console.log('ADD CAT', req.body.title);
    const kitty = new Cat({ title: req.body.title });
    kitty.save().then(() => console.log('meow'));

    res.send({ value: 'suces' });
  }
}
