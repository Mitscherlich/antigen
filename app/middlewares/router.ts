import { resolve } from 'path';
import KoaApplication from 'koa';

import Route from '../decorators/route';

const r = (path: string) => resolve(__dirname, path);

const prefix = process.env.BASE_URL || '/';

export default (app: KoaApplication) => {
  const apiPath = r('../controllers');
  const router = new Route(app, apiPath, { prefix });
  router.init();
};
