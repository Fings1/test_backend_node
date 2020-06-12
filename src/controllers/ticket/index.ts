// Libraries
import { Response, NextFunction } from 'express';
import to from 'await-to-js';
import { shuffle } from 'lodash';
import jwt from 'jsonwebtoken';

// Joi schema
import schema from './schemaJoi';

// Models
import models from '../../models';

// Utils
import { verifyToken } from '../../controllers/utils';

const ticketTokenSecret = process.env.TICKET_TOKEN_SECRET || 'qwert';

//#region create ticket

/**
 *  Validate create ticket params
 */
const validateParams = async (req: IRequest, res: Response, next: NextFunction) => {
  const params: ITicketData = req.body;

  // Validate params
  const [error] = await to(schema.createTicketSchema.validateAsync(params));

  if (error) {
    return res.status(400).send({ message: `invalid params ${error.message}` });
  }

  return next();
}

/**
 *  Validate relation client and service
 */
const validateClientAndService = async (req: IRequest, res: Response, next: NextFunction) => {
  const params: ITicketData = req.body;
  const user = req.user;

  // get user from DB
  const [errorClient, responseClient] = await to<IDocument, Error>(models.User.findById(user.sub).exec());
  if (errorClient) {
    return res.status(500).send({ message: `Query error ${errorClient.message}` });
  }

  if (!responseClient) {
    return res.status(400).send({ message: 'The client does not exist' });
  }

  // set cliendId
  params.clientId = user.sub;

  // get service from DB
  const [errorService, responseService] = await to<IDocument, Error>(models.Service.findById(params.serviceId).exec());
  if (errorService) {
    return res.status(500).send({ message: `Query error ${errorService.message}` });
  }

  if (!responseService) {
    return res.status(400).send({ message: 'The service does not exist' });
  }

  return next();
}

/**
 *  Validate role for create ticket
 */
const validateRole = async (req: IRequest, res: Response, next: NextFunction) => {
  const user = req.user;
  if (user.role === 'CLIENT') {
    return next();
  }

  return res.status(401).send({ message: 'Invalid role for save a ticket' });
}

/**
 * Get all user type worker and assign  ramdom worker to ticket
 */
const getRandomWorker = async (req: IRequest, res: Response, next: NextFunction) => {
  const params: ITicketData = req.body;

  // Get all workers
  const [errorQuery, response] = await to<IDocument[], Error>(models.WorkerService.find({ serviceId: params.serviceId }).exec());
  if (errorQuery) {
    return res.status(500).send({ message: `Query error ${errorQuery.message}` });
  }

  if (!response.length) {
    return res.status(500).send({ message: 'Could not find workers' });
  }

  const ramdomWorkers = shuffle(response);
  params.workerId = ramdomWorkers[0].id;

  return next();
};

const saveTicket = async (req: IRequest, res: Response, next: NextFunction) => {
  const params: ITicketData = req.body;

  // Save ticket in DB
  const [errorSave, response] = await to<IDocument, Error>(models.Ticket.create(params));
  if (errorSave) {
    return res.status(500).send({ message: `Save error ${errorSave.message}` });
  }

  req.data = response.getData(response);

  return next();
};

/**
 * Generate token and URLS
 */
const createTokenAndUrls = async (req: IRequest, res: Response) => {
  const data: ITicketData = req.data;

  const tokenDate = {
    id: data.id,
    status: data.status,
    clientId: data.clientId,
    workerId: data.workerId,
  }

  const accessToken = jwt.sign(tokenDate, ticketTokenSecret);
  const trackingLink = `http://localhost:8000/api/v1/ticket/tracking/${accessToken}`;
  const ratingLink = `http://localhost:8000/api/v1/ticket/rating/${accessToken}`;

  return res.status(200).send({ ticketToken: accessToken, trackingLink, ratingLink })
};
//#endregion create ticket

//#region tracking ticket

/**
 *  Get all ticket info
 */
const getTicketData = async (req: IRequest, res: Response) => {
  const token: string = req.param('token');

  if (!token) {
    return res.status(401).send({ message: 'Missing token' });
  }

  const [error, ticket] = await to<ITicketData, Error>(verifyToken(token, ticketTokenSecret));

  if (error) {
    return res.status(401).send({ message: 'Invalid token' });
  }

  const [errorQuery, response] = await to<IDocument, Error>(models.Ticket.findById(ticket.id).populate('User').exec());
  if (errorQuery) {
    return res.status(500).send({ message: `Query error ${errorQuery.message}` });
  }

  return res.status(200).send({ data: response.getData(response) });
};
//#endregion tracking ticket

//#region rating ticket

/**
 *  Set rating to ticket
 */
const ratingTicket = async (req: IRequest, res: Response) => {
  const token: string = req.param('token');
  const rating: number = Number(req.param('rating'));

  if (!token || !rating) {
    return res.status(401).send({ message: 'Missing params' });
  }

  const [error, ticket] = await to<ITicketData, Error>(verifyToken(token, ticketTokenSecret));

  if (error) {
    return res.status(401).send({ message: 'Invalid token' });
  }

  // Update data
  const [errorUpdate, response] = await to<IDocument, Error>(models.Ticket.update({ _id: ticket.id }, { rating }).exec());
  if (errorUpdate) {
    return res.status(500).send({ message: `Query error ${errorUpdate.message}` });
  }

  return res.status(200).send({ data: response.getData(response) });
};
//#endregion rating ticket

export default {
  validateParams,
  validateClientAndService,
  validateRole,
  getRandomWorker,
  saveTicket,
  createTokenAndUrls,
  getTicketData,
  ratingTicket,
}