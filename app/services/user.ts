import User from '../database/models/user';

// db.collection('user').find({})
export const fetchUsers = async () => {
  return await User.find({}).exec();
};

// db.collection('user').findOne({ token })
export const findUserByToken = async (token: string) => {
  return await User.findOne({ token }).exec();
};

// db.collection('user').findOne({ name })
export const findUserByName = async (name: string) => {
  return await User.findOne({ name }).exec();
};
