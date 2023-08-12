import { Schema } from 'mongoose';

export const UserSchema = new Schema({
  password: { type: String, required: true },
});