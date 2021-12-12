import { Request, Response } from 'express';
import { IController } from '../types';
import mongoose, { Schema } from 'mongoose';
import shortid from 'shortid';

const User = new Schema({
  id: String,
  digits: String,
  password: String,
  nickname: String,
});

function filterUndefinedKeys(obj: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));
}

function Controller(name: string) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return (ctor: Function) => {
    // @ts-ignore
    ctor.__baseUrl = name;
  };
}

@Controller('/login')
class LoginController implements IController {
  public async post(req: Request, res: Response) {
    const { digits, password } = req.body;

    const UserModel = mongoose.model('User', User);

    const results = await UserModel.find({ digits, password });

    if (results.length === 0) res.send({ type: 'error', error: 'User not found' });
    if (results.length > 0) res.send({ type: 'success', data: results[0] });
  }
}

@Controller('/user')
class UserController implements IController {
  public async post(req: Request, res: Response) {
    const { id, digits } = req.body;

    const UserModel = mongoose.model('User', User);

    const results = await UserModel.find(filterUndefinedKeys({id, digits}));

    console.log(results);
    if (results.length === 0) res.send({ type: 'error', error: 'User not found' });
    if (results.length > 0) res.send({ type: 'success', data: results[0] });
  }
}

@Controller('/register')
class RegisterController implements IController {
  public async post(req: Request, res: Response) {
    const { digits, password, nickname } = req.body;
    console.log(digits, password, nickname);

    const UserModel = mongoose.model('User', User);

    const results = await UserModel.find({ digits });
    if (results.length > 0) {
      res.send({ type: 'error', error: 'Digits already' });
      return;
    }

    const user = new UserModel({ digits, password, nickname, id: shortid() });
    const result = await user.save();

    res.send({ type: 'success', data: result });
  }
}

export { LoginController, RegisterController, UserController };
