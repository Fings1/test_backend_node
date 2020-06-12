// Libraries
import mongoose from 'mongoose';

// Utils
import { getData } from './utils';

// Define schema
const Schema = mongoose.Schema;

const workerServiceSchema = new Schema({
  workerId: { type: Schema.Types.ObjectId, ref: 'User' },
  serviceId: { type: Schema.Types.ObjectId, ref: 'Service' },
});

// Get sanitize data
workerServiceSchema.methods.getData = getData;

export default mongoose.model('WorkerService', workerServiceSchema);
