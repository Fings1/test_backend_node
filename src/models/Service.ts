// Libraries
import mongoose from 'mongoose';

// Utils
import { getData } from './utils';

// Define schema
const Schema = mongoose.Schema;

const serviceSchema = new Schema({
  name: { type: String, required: true },
  description: String,
});

// Get sanitize data
serviceSchema.methods.getData = getData;

export default mongoose.model('Service', serviceSchema);
