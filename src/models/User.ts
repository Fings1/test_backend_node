// Libraries
import mongoose from 'mongoose';

// Utils
import { getData } from './utils';

// Define schema
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: String,
  userType: {
    type: String,
    enum: ['CLIENT', 'WORKER', 'ADMIN'],
    required: true
  },
  phone: String,
  email: String,
  password: { type: String, required: true },
  dni: { type: String, unique: true, required: true }
});

// Get sanitize data
userSchema.methods.getData = getData;


export default mongoose.model('User', userSchema);
