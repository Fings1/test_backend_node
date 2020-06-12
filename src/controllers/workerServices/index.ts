// Libraries
import { Response, NextFunction } from 'express';
import to from 'await-to-js';
import { forEach } from 'lodash';

// Joi schema
import schema from './schemaJoi';

// Models
import models from '../../models';

//#region create worker service

/**
 *  Validate create worker service params
 */
const validateParams = async (req: IRequest, res: Response, next: NextFunction) => {
  const params: IWorkerServiceData = req.body;

  // Validate params
  const [error] = await to(schema.createWorkerServices.validateAsync(params));

  if (error) {
    return res.status(400).send({ message: `invalid params ${error.message}` });
  }

  return next();
}

/**
 *  Validate role for create worker service
 */
const validateRole = async (req: IRequest, res: Response, next: NextFunction) => {
  const user = req.user;

  if (user.role === 'ADMIN' || user.role === 'WORKER') {
    return next();
  }

  return res.status(401).send({ message: 'Invalid role for save a worker service' });
}

/**
 *  Validate  if exists worker and service
 */
const validateWorkerAndServiceIds = async (req: IRequest, res: Response, next: NextFunction) => {
  const params: IWorkerServiceData = req.body;

  // get worker from DB
  const [errorClient, responseClient] = await to<IDocument, Error>(models.User.findById(params.workerId).exec());
  if (errorClient) {
    return res.status(500).send({ message: `Query error ${errorClient.message}` });
  }

  if (!responseClient) {
    return res.status(400).send({ message: 'The worker does not exist' });
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

const saveWorkerService = async (req: IRequest, res: Response) => {
  const params: IWorkerServiceData = req.body;

  // Save worker service in DB
  const [errorSave, response] = await to<IDocument, Error>(models.WorkerService.create(params));
  if (errorSave) {
    return res.status(500).send({ message: `Save error ${errorSave.message}` });
  }

  return res.status(200).send({ data: response.getData(response) });
};
//#endregion create worker service


//#region get worker services

/**
 *  Validate role for get worker service
 */
const validateRoleWorker = async (req: IRequest, res: Response, next: NextFunction) => {
  const user = req.user;

  if (user.role === 'WORKER') {
    return next();
  }

  return res.status(401).send({ message: 'Invalid role for get worker services' });
}

const getWorkerServices = async (req: IRequest, res: Response) => {
  const user = req.user;

  // Get worker services from DB
  const [errorQuery, response] = await to<IDocument[], Error>(models.WorkerService.find({ workerId: user.sub }).exec());
  if (errorQuery) {
    return res.status(500).send({ message: `Query error ${errorQuery.message}` });
  }

  const workerServices: IWorkerServiceData[] = [];
  forEach(response, (value) => {
    workerServices.push(value.getData(value))
  })

  return res.status(200).send({ data: workerServices });
};
//#endregion get worker services

export default {
  validateParams,
  validateRole,
  validateWorkerAndServiceIds,
  saveWorkerService,
  validateRoleWorker,
  getWorkerServices
}