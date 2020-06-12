import joi from '@hapi/joi';

// Define joi schema for login params
const registerSchema = joi.object({
  firstName: joi.string().required(),
  dni: joi.string().required(),
  password: joi.string().required(),
  userType: joi.string().required(),
  lastName: joi.string(),
  phone: joi.string(),
  email: joi.string(),
})

// Define joi schema for register params
const loginSchema = joi.object({
  dni: joi.string().required(),
  password: joi.string().required(),
})

export default {
  registerSchema,
  loginSchema
}