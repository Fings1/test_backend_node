// Libraries
import mongoose from 'mongoose';

// Define schema
const Schema = mongoose.Schema;

const ticketSchema = new Schema({
  token: String,
  status: {
    type: String,
    enum: ['CREATED', 'ASSIGNED', 'IN_PROGRESS', 'FINISHED'],
    default: 'CREATED'
  },
  clientId: { type: Schema.Types.ObjectId, ref: 'User' },
  workerId: { type: Schema.Types.ObjectId, ref: 'User' },
  serviceId: { type: Schema.Types.ObjectId, ref: 'User' },
  rating: Number,
  address: String,
  latitude: Number,
  longitude: Number,
  hour: String,
  notes: String,
})

export default mongoose.model('Ticket', ticketSchema);
