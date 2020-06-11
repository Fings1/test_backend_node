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
  clientId: Schema.Types.ObjectId,
  workerId: Schema.Types.ObjectId,
  serviceId: Schema.Types.ObjectId,
  rating: Number,
  address: String,
  latitude: Number,
  longitude: Number,
  hour: String,
  notes: String,
})

export default mongoose.model('Ticket', ticketSchema);
