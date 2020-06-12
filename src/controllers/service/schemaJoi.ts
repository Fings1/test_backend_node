import joi from '@hapi/joi';

// Define joi schema for create service
const createServiceSchema = joi.object({
  name: joi.string().required(),
  description: joi.string(),
})

export default {
  createServiceSchema,
}