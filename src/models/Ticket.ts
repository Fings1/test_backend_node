// Libraries
import mongoose from 'mongoose';

// Utils
import { getData } from './utils';

// Define schema
const Schema = mongoose.Schema;

const ticketSchema = new Schema({
  token: String,
  status: {
    type: String,
    enum: ['CREATED', 'ASSIGNED', 'IN_PROGRESS', 'FINISHED'],
    default: 'CREATED'
  },
  clientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  workerId: { type: Schema.Types.ObjectId, ref: 'User' },
  serviceId: { type: Schema.Types.ObjectId, ref: 'User' },
  rating: Number,
  address: String,
  latitude: Number,
  longitude: Number,
  date: { type: Date, required: true },
  notes: String,
});

// Get sanitize data
ticketSchema.methods.getData = getData

export default mongoose.model('Ticket', ticketSchema);
