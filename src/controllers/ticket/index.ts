// Libraries
import { Response, NextFunction } from 'express';
import to from 'await-to-js';

// Joi schema
import schema from './schemaJoi';

// Models
import models from '../../models';

//#region create ticket

/**
 *  Validate create ticket params
 */
const validateCreateTicketParams = async (req: IRequest, res: Response, next: NextFunction) => {
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

  // get user from DB
  const [errorClient, responseClient] = await to<IDocument, Error>(models.User.findById(params.clientId).exec());
  if (errorClient) {
    return res.status(500).send({ message: `Query error ${errorClient.message}` });
  }

  if (!responseClient) {
    return res.status(400).send({ message: 'The client does not exist' });
  }

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

const saveTicket = async (req: IRequest, res: Response) => {
  const params: ITicketData = req.body;

  // Save ticket in DB
  const [errorSave, response] = await to<IDocument, Error>(models.Ticket.create(params));
  if (errorSave) {
    return res.status(500).send({ message: `Save error ${errorSave.message}` });
  }

  return res.status(200).send({ data: response.getData(response) });
};

//#endregion create ticket

export default {
  ticket: {
    validateCreateTicketParams,
    validateClientAndService,
    saveTicket,
  },
}