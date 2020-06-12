// Libraries
import { Response, NextFunction } from 'express';
import to from 'await-to-js';
import bcryptJs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { forEach } from 'lodash';

// Joi schema
import schema from './schemaJoi';

// Models
import models from '../../models';

const tokenSecret = process.env.TOKEN_SECRET || 'qwer';

//#region Login

/**
 *  Validate login params
 */
const validateLoginParams = async (req: IRequest, res: Response, next: NextFunction) => {
  const params: IUserData = req.body;

  // Validate params
  const [error] = await to(schema.loginSchema.validateAsync(params));

  if (error) {
    return res.status(400).send({ message: `invalid params ${error.message}` });
  }

  return next();
}

/**
 * Validate password for the user
 */
const validatePassword = async (req: IRequest, res: Response, next: NextFunction) => {
  const params: IUserData = req.body;

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

  req.data = response.getData(response);

  return next();
};

const createToken = async (req: IRequest, res: Response) => {
  const data: IUserData = req.data;

  const tokenDate = {
    sub: data.id,
    name: `${data.firstName} ${data.lastName || ''}`,
    role: data.userType,
  }

  const accessToken = jwt.sign(tokenDate, tokenSecret, { expiresIn: '1d' });

  return res.status(200).send({ accessToken });
}
//#endregion Login

//#region Register

/**
 *  Validate Register user params
 */
const validateRegisterParams = async (req: IRequest, res: Response, next: NextFunction) => {
  const params: IUserData = req.body;

  // Validate params
  const [error] = await to(schema.registerSchema.validateAsync(params));

  if (error) {
    return res.status(400).send({ message: `invalid params ${error.message}` });
  }

  return next();
}

/**
 * Validate user type value
 */
const validateUserType = async (req: IRequest, res: Response, next: NextFunction) => {
  const params: IUserData = req.body;
  const validUserTypes: UserTypes[] = ['ADMIN', 'CLIENT', 'WORKER'];

  if (!validUserTypes.includes(params.userType)) {
    return res.status(400).send({ message: `invalid userType` });
  }

  return next();
}

/**
 * Set encrypt password
 */
const encryptPassword = async (req: IRequest, res: Response, next: NextFunction) => {
  const params: IUserData = req.body;

  // Hash password
  const [errorHash, passwordHash] = await to(bcryptJs.hash(params.password, 10));
  if (errorHash) {
    return res.status(400).send({ message: `invalid params ${errorHash.message}` });
  }

  // Set hash password to params
  params.password = passwordHash;

  return next();
}

const saveUser = async (req: IRequest, res: Response) => {
  const params: IUserData = req.body;

  // Save user in DB
  const [errorSave, response] = await to<IDocument, Error>(models.User.create(params));
  if (errorSave) {
    return res.status(500).send({ message: `Save error ${errorSave.message}` });
  }

  return res.status(200).send({ data: response.getData(response) });
};

//#endregion Register

//#region get workers
/**
 *  Validate role for get workers
 */
const validateRole = async (req: IRequest, res: Response, next: NextFunction) => {
  const user = req.user;

  if (user.role === 'ADMIN') {
    return next();
  }

  return res.status(401).send({ message: 'Invalid role for get all workers' });
}

const getAllWorkers = async (req: IRequest, res: Response) => {
  // Get all workers from DB
  const [errorQuery, response] = await to<IDocument[], Error>(models.User.find({ userType: 'WORKER' }).exec());
  if (errorQuery) {
    return res.status(500).send({ message: `Query error ${errorQuery.message}` });
  }

  const workers: IUserData[] = [];
  forEach(response, (value) => {
    workers.push(value.getData(value))
  })

  return res.status(200).send({ data: workers });
};
//#endregion get workers

export default {
  validateLoginParams,
  validatePassword,
  createToken,
  validateRegisterParams,
  validateUserType,
  encryptPassword,
  saveUser,
  validateRole,
  getAllWorkers
}