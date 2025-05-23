import Joi from 'joi';
import { joiMessagesES } from '../../../shared/utils/joi-messages';
import { updateProfessionalBussinessHourSchema } from './professionalBussinessHourUpdate.schema';
import { updateProfessionalServiceSchema } from './professionalServiceUpdate.schema';

export const updateProfessionalSchema = Joi.object({
  VcFirstName: Joi.string().min(3).max(100).required(),
  VcSecondName: Joi.string().min(3).max(100).allow('', null),
  VcFirstLastName: Joi.string().min(3).max(100).required(),
  VcSecondLastName: Joi.string().min(3).max(100).allow('', null),
  VcEmail: Joi.string().email().required(),
  VcPhone: Joi.string().min(6).max(20).allow('', null),
  VcIdentificationNumber: Joi.string().min(6).max(20).required(),
  VcLicenseNumber: Joi.string().min(6).max(50).allow('', null),
  IYearsOfExperience: Joi.number().integer().default(0),
  TxPhoto: Joi.string().uri().allow('', null)
    .messages({
      'string.uri': 'La URL de la imagen debe tener un formato válido'
    }),
  VcProfession: Joi.string().min(3).max(100).required(),
  VcSpecialization: Joi.string().min(3).max(100).allow('', null),

  BussinessHours: Joi.alternatives().try(
    Joi.array().items(updateProfessionalBussinessHourSchema),
    Joi.string()
  ).optional(),
  Services: Joi.alternatives().try(
    Joi.array().items(updateProfessionalServiceSchema),
    Joi.string()
  ).optional()
}).messages(joiMessagesES);
