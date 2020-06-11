// Libraries
import mongoose from 'mongoose';

// Define schema
const Schema = mongoose.Schema;

const workerServiceSchema = new Schema({
  workerId: Schema.Types.ObjectId,
  serviceId: Schema.Types.ObjectId,
})

export default mongoose.model('WorkerService', workerServiceSchema);
