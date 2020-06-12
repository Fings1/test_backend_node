// Libraries
import mongoose from 'mongoose';

// Define schema
const Schema = mongoose.Schema;

const workerServiceSchema = new Schema({
  workerId: { type: Schema.Types.ObjectId, ref: 'User' },
  serviceId: { type: Schema.Types.ObjectId, ref: 'Service' },
})

export default mongoose.model('WorkerService', workerServiceSchema);
