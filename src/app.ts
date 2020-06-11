// Libraries
import express from 'express';
import to from 'await-to-js';

// Connection
import { createConnection } from './models';

const app = express();

/**
 * Function for init express app
 */
export const initApp = async () => {

  // Routes
  app.get('/', async (req, res) => {
    res.send('Hello');
  });

  // Validate connection
  const [error] = await to(createConnection());
  if (error) {
    throw error;
  }

  return app;
}

