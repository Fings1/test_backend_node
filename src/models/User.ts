// Libraries
import mongoose, { Document } from 'mongoose';

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
userSchema.methods.getData = (doc: Document) => {
  const data = doc.toJSON();
  data.id = data._id;

  delete data._id;
  delete data.__v;
  delete data.password;

  return data;
}


export default mongoose.model('User', userSchema);
