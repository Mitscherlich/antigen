import mongoose from 'mongoose';
import UserSchema, { User } from '../schemas/user';

export default mongoose.model<User>('User', UserSchema);
