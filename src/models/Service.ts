// Libraries
import mongoose from 'mongoose';

// Define schema
const Schema = mongoose.Schema;

const serviceSchema = new Schema({
  name: String,
  description: String,
})

export default mongoose.model('Service', serviceSchema);
