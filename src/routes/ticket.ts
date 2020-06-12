// Libraries
import express from 'express';

// Controller
import ticketController from '../controllers/ticket';

const router = express.Router();

router.post('/createTicket',
  ticketController.ticket.validateCreateTicketParams,
  ticketController.ticket.validateClientAndService,
  ticketController.ticket.saveTicket,
);

export default router;