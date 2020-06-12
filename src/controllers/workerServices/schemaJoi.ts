import joi from '@hapi/joi';

// Define joi schema for create worker services
const createWorkerServices = joi.object({
  workerId: joi.string().required(),
  serviceId: joi.string().required(),
})

export default {
  createWorkerServices,
}