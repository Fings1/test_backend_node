// Libraries
import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import to from 'await-to-js';

// Models
import models from '../models';

const tokenSecret = process.env.TOKEN_SECRET || 'qwer';

/**
 *  Validate auth token
 */
export const validateAuthToken = async (req: IRequest, res: Response, next: NextFunction) => {

  if (!req.headers.authorization) {
    return res.status(401).send({ message: 'The token is missing' });
  }

  const token = req.headers.authorization.trim();

  const [error, user] = await to<IUserToken, Error>(verifyToken(token, tokenSecret));

  if (error) {
    return res.status(401).send({ message: 'Invalid token' });
  }

  // validate user in DB
  const [errorQuery, response] = await to<IDocument, Error>(models.User.findById(user.sub).exec());
  if (errorQuery || !response) {
    return res.status(500).send({ message: 'The user does not exist in the DB' });
  }

  req.user = user;

  return next();
}

/**
 * verify token with jwt
 */
export const verifyToken = (token: string, secret: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (error, user) => {
      if (error) {
        return reject(error);
      }

      return resolve(user);
    });
  });
}