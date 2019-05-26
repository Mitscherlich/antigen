import mongoose from 'mongoose';
import UserSchema, { IUser } from '../schemas/user';

export default mongoose.model<IUser>('User', UserSchema);
