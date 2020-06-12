// Libraries
import { Document } from 'mongoose';

// Get sanitize data
export const getData = (doc: Document) => {
  const data = doc.toJSON();
  data.id = data._id;

  delete data._id;
  delete data.__v;
  delete data.password;

  return data;
}