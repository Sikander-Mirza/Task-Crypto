import mongoose from 'mongoose';

const authSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  verifyToken: {
    type: String
  }
}, { timestamps: true });

const AuthModel = mongoose.model('Auth', authSchema);

export default AuthModel;
