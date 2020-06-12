import joi from '@hapi/joi';

// Define joi schema for create ticket
const createTicketSchema = joi.object({
  serviceId: joi.string().required(),
  address: joi.string(),
  latitude: joi.number(),
  longitude: joi.number(),
  notes: joi.string(),
  date: joi.date().required(),
})

export default {
  createTicketSchema,
}