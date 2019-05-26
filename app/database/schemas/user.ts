import { v4 as uuidv4 } from 'uuid';
import { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  token: string;
  index: number;
  name: string;
  image: string;
  last: string;
  meta: {
    createdAt: Date;
    updatedAt: Date;
  };
}

const UserScehma = new Schema<IUser>({
  token: { type: String, default: uuidv4() },
  index: { type: Number, required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  last: String,
  meta: {
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() }
  }
});

UserScehma.pre<IUser>('save', function(next: Function) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = new Date();
  } else {
    this.meta.updatedAt = new Date();
  }

  next();
});

UserScehma.pre<IUser>('save', function(next: Function) {
  const user = this;

  if (!user.isModified('image')) {
    return next();
  }

  try {
    const newToken = uuidv4();
    user.token = newToken;
    next();
  } catch (err) {
    return next(err);
  }
});

export default UserScehma;
