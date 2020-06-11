// Libraries
import mongoose from 'mongoose';
import to from 'await-to-js';

// Models
import User from './User';
import Service from './Service';
import Ticket from './Ticket';
import WorkerService from './WorkerService';

const mongoDBUri = process.env.MONGO_DB_URI || 'mongodb://localhost:27017/testBackendDB';

/**
 *  Connect with mongodb
 */
export const createConnection = async () => {
  const [error] = await to(mongoose.connect(mongoDBUri, { useNewUrlParser: true, useUnifiedTopology: true }));

  if (error) {
    throw error;
  }
};

export default {
  User,
  Service,
  Ticket,
  WorkerService
}
