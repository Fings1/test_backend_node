// Libraries
import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import to from 'await-to-js';

const tokenSecret = process.env.TOKEN_SECRET || 'qwer';

/**
 *  Validate auth token
 */
export const validateAuthToken = async (req: IRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization.trim();

  if (!token) {
    return res.status(401).send({ message: 'The token is missing' });
  }

  const [error, user] = await to<IUserToken, Error>(verifyToken(token));

  if (error) {
    return res.status(401).send({ message: 'Invalid token' });
  }

  req.user = user;

  return next();
}

/**
 * verify token with jwt
 */
const verifyToken = (token: string): Promise<IUserToken> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, tokenSecret, (error, user: IUserToken) => {
      if (error) {
        return reject(error);
      }

      return resolve(user);
    });
  });
}