import mongoose, { Document } from 'mongoose';

declare global {
  interface IDocument extends Document {
    getData?: (doc: Document) => IUserData;
  }
}