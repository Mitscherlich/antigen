import { Context } from 'koa';
import { controller, post } from '../decorators/route';
import { detect, landmark, identify } from '../utils/face';

@controller('/api')
export default class APIController {
  @post('/face/detection')
  public handleFaceDetection(ctx: Context) {
    const { image: base64 } = ctx.request.body;
    ctx.body = detect(base64);
  }

  @post('/face/landmarks')
  public handleFaceLandmarks(ctx: Context) {
    const { image: base64 } = ctx.request.body;
    ctx.body = landmark(base64);
  }

  @post('/face/identify')
  public handleFaceIdentification(ctx: Context) {
    const { image: base64 } = ctx.request.body;
    const landmarks = landmark(base64);
    try {
      const similars = identify(base64);
      ctx.body = Object.assign({ similars }, landmarks);
    } catch (ignoreError) {
      // fallback to landmarks
      ctx.body = landmarks;
    }
  }
}
