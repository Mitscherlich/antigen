import { Context } from 'koa';
import { controller, get, post } from '../decorators/route';
import { findUserByToken } from '../services/user';
import { compare } from '../utils/face';

@controller('')
export default class GateController {
  @get('/gates')
  public getReceptorList(ctx: Context) {
    const gates = [];
    for (const [id] of ctx.receptorMap) {
      gates.push({ id });
    }
    ctx.body = gates;
  }

  @get('/gate/:id/open')
  public handleGateOpen(ctx: Context) {
    const { id } = ctx.params;
    if (ctx.receptorMap.has(id)) {
      const receptor = ctx.receptorMap.get(id);
      receptor.emit('open gate');
      ctx.body = {
        success: true,
        message: 'gate has been opened'
      };
    } else {
      ctx.body = {
        success: false,
        message: 'no such receptor'
      };
    }
  }

  @post('/gate/:id/auth')
  public async handleGateAuth(ctx: Context) {
    const { id } = ctx.params;
    if (!ctx.receptorMap.has(id)) {
      return (ctx.body = {
        success: false,
        message: 'no such receptor'
      });
    }
    const { token, image: base64 } = ctx.request.body;
    const user = await findUserByToken(token);
    if (user) {
      const { image: signup } = user;
      const similar = compare(base64, signup);
      if (similar > 0.7) {
        const receptor = ctx.receptorsMap.get(id);
        receptor.emit('open gate');
        ctx.body = {
          success: true,
          message: 'gate has been open'
        };
      } else {
        ctx.body = {
          success: false,
          message: 'unauthorized user'
        };
      }
    } else {
      ctx.body = {
        success: false,
        message: 'no such user'
      };
    }
  }

  @post('/gate/auth')
  public async handleGateAuthLegacy(ctx: Context) {
    const { id } = ctx.query;
    if (!ctx.receptorMap.has(id)) {
      return (ctx.body = {
        success: false,
        message: 'no such receptor'
      });
    }
    const { token, image: base64 } = ctx.request.body;
    const user = await findUserByToken(token);
    if (user) {
      const { image: signup } = user;
      const similar = compare(base64, signup);
      ctx.body = similar > 0.7;
      if (similar > 0.7) {
        const receptor = ctx.receptorMap.get(id);
        receptor.emit('open gate');
      }
    } else {
      ctx.body = {
        success: false,
        message: 'no such user'
      };
    }
  }
}
