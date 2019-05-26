import QRcode from 'qrcode';
import { Context } from 'koa';
import { controller, get } from '../decorators/route';

@controller('')
export default class QRCodeController {
  @get('qrcode')
  public async getQRCodeImage(ctx: Context) {
    const { query } = ctx.request;
    const { content } = query;
    ctx.body = await QRcode.toDataURL(content || '');
  }
}
