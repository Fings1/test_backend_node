import joi from '@hapi/joi';

// Define joi schema for create ticket
const createTicketSchema = joi.object({
  serviceId: joi.string().required(),
  address: joi.string(),
  latitude: joi.number(),
  longitude: joi.number(),
  notes: joi.string(),
  date: joi.date().required(),
});

const updateTicketSchema = joi.object({
  id: joi.string().required(),
  status: joi.string(),
  address: joi.string(),
  latitude: joi.number(),
  longitude: joi.number(),
  notes: joi.string(),
  date: joi.date().required(),
  workerId: joi.string(),
  serviceId: joi.string(),
  rating: joi.number(),
});

export default {
  createTicketSchema,
  updateTicketSchema,
}