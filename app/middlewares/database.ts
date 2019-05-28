import { readdirSync } from 'fs';
import { resolve } from 'path';
import mongoose from 'mongoose';
import createDebugger from 'debug';

import { IUser } from '../database/schemas/user';
import { register } from '../utils/face';

const debug = createDebugger('antigen:db');

const dburl = process.env.DB_URL || '127.0.0.1';
const dbport = parseInt(process.env.DB_PORT || '27017');
const dbuser = process.env.DB_USER || '';
const dbpsk = process.env.DB_PSK || '';
const isDev = !(process.env.NODE_ENV === 'production');

const models = resolve(__dirname, '../database/schemas');

readdirSync(models)
  .filter(file => ~file.search(/^[^\.].*\.(ts|js)$/))
  .forEach(file => require(resolve(models, file)));

export default () => {
  if (isDev) {
    mongoose.set('debug', true);
  }

  let mongoUrl = `mongodb://`;
  if (dbuser) {
    mongoUrl += dbuser;
    if (dbpsk) {
      mongoUrl += `:${dbpsk}`;
    }
    mongoUrl += '@';
  }
  mongoUrl += `${dburl}:${dbport}/antigen`;
  if (dburl || dbpsk) {
    mongoUrl += '?authSource=admin';
  }

  mongoose.connect(mongoUrl, { useNewUrlParser: true });

  mongoose.connection.on('disconnected', () => {
    mongoose.connect(mongoUrl);
  });

  mongoose.connection.on('error', err => {
    debug(err);
  });

  mongoose.connection.once('open', async () => {
    debug(`connected to mongodb://${dburl}:${dbport}`);

    const User = mongoose.model<IUser>('User');

    const users = await User.find({}).exec();
    if (users && users.length) {
      for (const user of users) {
        const { image: base64 } = user;
        user.index = register(base64);
        await user.save();
      }
    }
  });
};
