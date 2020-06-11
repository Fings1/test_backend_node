// Libraries
import mongoose from 'mongoose';

// Define schema
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  userType: {
    type: String,
    enum: ['CLIENT', 'WORKER', 'ADMIN'],
    required: true
  },
  phone: String,
  email: String,
  password: String,
  dni: { type: String, unique: true }
})

export default mongoose.model('User', userSchema);
