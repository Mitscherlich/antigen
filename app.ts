import { resolve } from 'path';
import { FaceDetector, PointDetector, FaceRecognizer } from 'seeta';
import Bundler from 'parcel-bundler';
import R from 'ramda';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import logger from 'koa-logger';
import serve from 'koa-static';
import consola from 'consola';

const r = (path: string) => resolve(__dirname, path);
const MIDDLEWARE = ['database', 'router', 'ws'];
const bundler = new Bundler(r('./public/index.html'), {
  outDir: r('./public/dist')
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

const port = parseInt(process.env.PORT || '3000');
const host = process.env.HOST || '127.0.0.1';
const isDev = !(process.env.NODE_ENV === 'production');

export const detector = new FaceDetector(r('./models/SeetaFaceDetector2.0.ats'));
export const pointer = new PointDetector(r('./models/SeetaPointDetector2.0.pts5.ats'));
export const recognizer = new FaceRecognizer(r('./models/SeetaFaceRecognizer2.0.ats'));

// app.context.detector = detector;
// app.context.pointer = pointer;
// app.context.recognizer = recognizer;

app.use(
  bodyParser({
    formLimit: '10mb',
    jsonLimit: '10mb',
    textLimit: '10mb'
  })
);
app.use(serve('./public/dist'));

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
