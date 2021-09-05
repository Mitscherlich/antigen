import { resolve } from 'path';
import Router, { IRouterOptions } from 'koa-router';
import KoaApplication, { Middleware } from 'koa';
import glob from 'glob';

const symbolPrefix = Symbol('prefix');
const routersMap = new Map<ControllerOptions & { target: Constructor<Controller> }, Middlewares>();

const toArray = <T>(v: T) => (Array.isArray(v) ? v : [v]);

const normalizePath = (path: string) => (path.startsWith('/') ? path : `/${path}`);

export type KoaRouter = Router & {
  [methods: string]: Function;
};

export type Controller = any & {
  [symbolPrefix]?: string;
  [handler: string]: any;
};

export type Constructor<T> = (new (...args: any[]) => T) & (T & { [key: string]: any });

export type Middlewares = Middleware | Middleware[];

export interface ControllerOptions {
  method: string;
  path: string;
}

export default class Route {
  private app: KoaApplication;
  private router: KoaRouter;
  private apiPath: string;
  private options: IRouterOptions;

  constructor(app: KoaApplication, apiPath: string, options = {}) {
    this.app = app;
    this.apiPath = apiPath;
    this.options = options;
    this.router = new Router(options) as KoaRouter;
  }

  init() {
    glob.sync(resolve(this.apiPath, './*.{js,ts}')).forEach(require);

    for (const [conf, controller] of routersMap) {
      const controllers = toArray(controller);
      let prefixPath = conf.target[symbolPrefix];
      if (prefixPath) {
        prefixPath = normalizePath(prefixPath);
      }
      const routerPath = prefixPath + conf.path;
      this.router[conf.method](routerPath, ...controllers);
    }

    this.app.use(this.router.routes());
    this.app.use(this.router.allowedMethods());
  }
}

export const router = (conf: ControllerOptions) => (
  target: Constructor<Controller>,
  key: string
) => {
  conf.path = normalizePath(conf.path);

  routersMap.set(
    {
      target,
      ...conf
    },
    target[key]
  );
};

export const controller = (path: string) => (target: Constructor<Controller & any>) => {
  target.prototype[symbolPrefix] = path;
};

export const get = (path: string) =>
  router({
    method: 'get',
    path
  });

export const post = (path: string) =>
  router({
    method: 'post',
    path
  });

export const put = (path: string) =>
  router({
    method: 'put',
    path
  });

export const del = (path: string) =>
  router({
    method: 'del',
    path
  });
