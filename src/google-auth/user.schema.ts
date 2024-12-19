import * as mongoose from 'mongoose';

export const UsersGoogleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  photo: { type: String },
});

