// Libraries
import express from 'express';
import to from 'await-to-js';
import bodyParser from 'body-parser';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';

// Router
import routes from './routes';

// Connection
import { createConnection } from './models';

const app = express();

/**
 * Function for init express app
 */
export const initApp = async () => {

  // Set middlewares
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())
  // prevent injections
  app.use(mongoSanitize());
  app.use(helmet());

  // Routes
  app.use('/user', routes.userRoutes);

  app.get('/healthcheck', async (req, res) => {
    res.status(200).send('OK');
  });

  // Validate connection
  const [error] = await to(createConnection());
  if (error) {
    throw error;
  }

  return app;
}

