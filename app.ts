import { resolve } from 'path';
import { FaceDetector, PointDetector, FaceRecognizer } from 'seeta';
import Bundler from 'parcel-bundler';
import R from 'ramda';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import logger from 'koa-logger';
import mount from 'koa-mount';
import serve from 'koa-static';
import consola from 'consola';

declare module 'koa' {
  interface Request {
    body?: any;
    rawBody: string;
  }
}

const r = (path: string) => resolve(__dirname, path);
const MIDDLEWARE = ['database', 'router', 'ws'];
const bundler = new Bundler(r('./public/index.html'), {
  outDir: r('./public/dist'),
  publicUrl: process.env.BASE_URL || '/'
});
const app = new Koa();

const useMiddleware = (app: Koa) =>
  R.map(
    R.compose(
      R.map((i: Function) => i(app)),
      require,
      (i: string) => `${r('./app/middlewares')}/${i}`
    )
  );

const baseUrl = process.env.BASE_URL || '/';
const port = parseInt(process.env.PORT || '3000');
const host = process.env.HOST || '127.0.0.1';
const isDev = !(process.env.NODE_ENV === 'production');

export const detector = new FaceDetector(r('./models/SeetaFaceDetector2.0.ats'));
export const pointer = new PointDetector(r('./models/SeetaPointDetector2.0.pts5.ats'));
export const recognizer = new FaceRecognizer(r('./models/SeetaFaceRecognizer2.0.ats'));

app.use(mount(baseUrl, serve('./public/dist')));
app.use(
  bodyParser({
    formLimit: '10mb',
    jsonLimit: '10mb',
    textLimit: '10mb'
  })
);

if (isDev) {
  app.use(logger());
}

async function start() {
  await useMiddleware(app)(MIDDLEWARE);

  if (isDev) {
    await bundler.bundle();
  }

  app.listen(port, host);

  consola.ready({
    message: `app running on http://${host}:${port}`,
    badge: true
  });
}

start();
