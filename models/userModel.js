import mongoose from 'mongoose';
import crypto from 'crypto'

const UserSchema = mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true,
      minLength: 2,
      maxLength: 30
    },
    password: {
      type: String,
      /* required: true, */
      /* minLength: 6 */
    },
    accessToken: {
      type: String,
      default: () => crypto.randomBytes(128).toString('hex')
    }
  });
  
  export const User = mongoose.model('User', UserSchema)