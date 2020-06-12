// Libraries
import { Request, Response } from 'express';
import to from 'await-to-js';
import bcryptJs from 'bcryptjs';

// Joi schema
import schema from './schemaJoi';

// Models
import models from '../../models';

/**
 * Controller for validate user access
 */
export const login = async (req: Request, res: Response) => {
  const params: IUserData = req.body;

  // Validate params
  const [error] = await to(schema.loginSchema.validateAsync(params));

  if (error) {
    return res.status(400).send({ message: `invalid params ${error.message}` });
  }

  // get user from DB
  const [errorQuery, response] = await to<IDocument, Error>(models.User.findOne({ dni: params.dni }).exec());
  if (errorQuery) {
    return res.status(500).send({ message: `Query error ${errorQuery.message}` });
  }

  const data: IUserData = response.toJSON();

  // validate password
  const [errorCompare, validPassword] = await to(bcryptJs.compare(params.password, data.password));

  if (errorCompare || !validPassword) {
    return res.status(400).send({ message: 'invalid password' });
  }

  return res.status(200).send({ data: response.getData(response), token: "TEST" });
};

/**
 * Controller for valdiate aprams and register user
 */
export const register = async (req: Request, res: Response) => {
  const params: IUserData = req.body;

  // Validate params
  const [error] = await to(schema.registerSchema.validateAsync(params));

  if (error) {
    return res.status(400).send({ message: `invalid params ${error.message}` });
  }

  const validUserType = validateUserType(params.userType);

  if (!validUserType) {
    return res.status(400).send({ message: `invalid userType` });
  }

  // Hash password
  const [errorHash, passwordHash] = await to(bcryptJs.hash(params.password, 10));
  if (errorHash) {
    return res.status(400).send({ message: `invalid params ${errorHash.message}` });
  }

  // Set hash password to params
  params.password = passwordHash;

  // Save user in DB
  const [errorSave, response] = await to<IDocument, Error>(models.User.create(params));
  if (errorSave) {
    return res.status(500).send({ message: `Save error ${errorSave.message}` });
  }

  return res.status(200).send({ data: response.getData(response) });
};

const validateUserType = (userType: UserTypes) => {
  const validUserTypes: UserTypes[] = ['ADMIN', 'CLIENT', 'WORKER'];

  if (validUserTypes.includes(userType)) {
    return true;
  }

  return false;
}