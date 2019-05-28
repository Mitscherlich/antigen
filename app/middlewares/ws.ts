import { createServer, Server } from 'http';
import KoaAppliaction from 'koa';
import SokcetIO, { Socket } from 'socket.io';
import createDebugger from 'debug';

const debug = createDebugger('antigen:ws');
const baseUrl = process.env.BASE_URL || '/';
const receptorMap = new Map<string, Socket>();

export default (app: KoaAppliaction & { server?: Server }) => {
  const server = createServer(app.callback());
  const io = SokcetIO(server, {
    path: `${baseUrl}/socket.io`
  });

  if (!app.server) {
    app.server = server;
    app.listen = (...args: any[]) => server.listen(...args);
  }

  app.context.receptorMap = receptorMap;

  // namespae receptor
  io.of('/receptor').on('connect', (socket: Socket) => {
    socket.once('register', ({ id }) => {
      socket.id = id;
      receptorMap.set(id, socket);
      debug(`A new receptor comes in. ID: ${id}`);
    });

    socket.on('disconnect', (reason: string) => {
      const { id } = socket;
      if (receptorMap.has(id)) {
        receptorMap.delete(id);
        debug(`Lost connection: ${reason}. ID: ${id}`);
      }
    });
  });

  // namespace glycoprotein
  io.of('/glycoprotein').on('connect', (socket: Socket) => {
    debug('A new glycoprotein comes in');

    socket.on('disconnect', (reason: string) => {
      debug(`Disconnect: ${reason}`);
    });
  });
};
