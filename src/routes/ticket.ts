// Libraries
import express from 'express';

// Controller
import ticketController from '../controllers/ticket';
import { validateAuthToken } from '../controllers/utils';

const router = express.Router();

router.post('/createTicket',
  validateAuthToken,
  ticketController.validateRole,
  ticketController.validateParams,
  ticketController.validateClientAndService,
  ticketController.getRandomWorker,
  ticketController.saveTicket,
  ticketController.createTokenAndUrls,
);

router.post('/updateTicket',
  validateAuthToken,
  ticketController.validateUpteRole,
  ticketController.validateUpdateParams,
  ticketController.updateTicket,
);

router.get('/tracking/:token',
  validateAuthToken,
  ticketController.validateRole,
  ticketController.getTicketData
);

router.get('/rating/:token/:rating',
  validateAuthToken,
  ticketController.validateRole,
  ticketController.ratingTicket
);

export default router;