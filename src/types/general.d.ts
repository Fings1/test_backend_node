// Libraries
import { Request } from 'express';
import mongoose, { Document } from 'mongoose';

declare global {
  interface IDocument extends Document {
    getData?: (doc: Document) => IUserData;
  }

  interface IRequest extends Request {
    data?: any;
    user?: IUserToken;
  }

  interface IUserToken {
    sub: string,
    name: string,
    role: UserTypes,
  }
}