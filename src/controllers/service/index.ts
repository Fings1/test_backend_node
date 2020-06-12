// Libraries
import { Response, NextFunction } from 'express';
import to from 'await-to-js';
import { forEach } from 'lodash';

// Joi schema
import schema from './schemaJoi';

// Models
import models from '../../models';

//#region create service

/**
 *  Validate create service params
 */
const validateParams = async (req: IRequest, res: Response, next: NextFunction) => {
  const params: IServiceData = req.body;

  // Validate params
  const [error] = await to(schema.createServiceSchema.validateAsync(params));

  if (error) {
    return res.status(400).send({ message: `invalid params ${error.message}` });
  }

  return next();
}

/**
 *  Validate role for create service
 */
const validateRole = async (req: IRequest, res: Response, next: NextFunction) => {
  const user = req.user;

  if (user.role === 'ADMIN') {
    return next();
  }

  return res.status(401).send({ message: 'Invalid role for save a service' });
}

const saveService = async (req: IRequest, res: Response) => {
  const params: IServiceData = req.body;

  // Save Service in DB
  const [errorSave, response] = await to<IDocument, Error>(models.Service.create(params));
  if (errorSave) {
    return res.status(500).send({ message: `Save error ${errorSave.message}` });
  }

  return res.status(200).send({ data: response.getData(response) });
};

const getAllServices = async (req: IRequest, res: Response) => {
  // Get services from DB
  const [errorQuery, response] = await to<IDocument[], Error>(models.Service.find({}).exec());
  if (errorQuery) {
    return res.status(500).send({ message: `Query error ${errorQuery.message}` });
  }

  const services: IServiceData[] = [];
  forEach(response, (value) => {
    services.push(value.getData(value))
  })

  return res.status(200).send({ data: services });
};

//#endregion create service

export default {
  validateParams,
  validateRole,
  saveService,
  getAllServices,
}