import { Context } from 'koa';
import { controller, get, post } from '../decorators/route';
import { fetchUsers, findUserByToken, findUserByName } from '../services/user';
import { register, compare } from '../utils/face';
import User from '../database/models/user';

@controller('')
export default class UserController {
  @get('/users')
  public async getUserList(ctx: Context) {
    ctx.body = await fetchUsers();
  }

  @post('/user/signup')
  public async handleUserSignUp(ctx: Context) {
    const { request } = ctx;
    const { name, image } = request.body;
    const index = register(image);
    const user = new User({ name, image, index });
    await user.save();
    ctx.body = user.token;
  }

  @get('/user/token')
  public async handleGetUserInfo(ctx: Context) {
    const { name } = ctx.query;
    const user = await findUserByName(name);
    if (user) {
      ctx.body = user.token;
    } else {
      ctx.body = {
        success: false,
        message: 'no such user'
      };
    }
  }

  @get('/user/:name/token')
  public async handleGetUserToken(ctx: Context) {
    const { name } = ctx.params;
    const user = await findUserByName(name);
    if (user) {
      ctx.body = user.token;
    } else {
      ctx.body = {
        success: false,
        message: 'no such user'
      };
    }
  }

  @post('/user/auth')
  public async handleUserAuth(ctx: Context) {
    const { request } = ctx;
    const { token, image: base64 } = request.body;
    const user = await findUserByToken(token);
    if (user) {
      const { image: signup } = user;
      const similar = compare(base64, signup);
      ctx.body = similar > 0.7;
      user.last = base64;
      await user.save();
    } else {
      ctx.body = {
        success: false,
        message: 'no such user'
      };
    }
  }
}
