import Joi from 'joi';
import { VALIDATION_RULES, FREQUENCIES, ERROR_MESSAGES } from './constants.js';

export const validateRegistration = (data) => {
  const schema = Joi.object({
    firstName: Joi.string().required().messages({
      'any.required': 'Le prénom est requis',
    }),
    lastName: Joi.string().required().messages({
      'any.required': 'Le nom est requis',
    }),
    email: Joi.string().email().required().messages({
      'string.email': ERROR_MESSAGES.INVALID_EMAIL,
      'any.required': "L'email est requis",
    }),
    password: Joi.string()
      .min(VALIDATION_RULES.MIN_PASSWORD_LENGTH)
      .max(VALIDATION_RULES.MAX_PASSWORD_LENGTH)
      .required()
      .messages({
        'string.min': ERROR_MESSAGES.INVALID_PASSWORD,
        'any.required': 'Le mot de passe est requis',
      }),
  });
  return schema.validate(data, { abortEarly: false });
};

export const validateLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': ERROR_MESSAGES.INVALID_EMAIL,
      'any.required': "L'email est requis",
    }),
    password: Joi.string().required().messages({
      'any.required': 'Le mot de passe est requis',
    }),
  });
  return schema.validate(data, { abortEarly: false });
};

export const validateTransaction = (data) => {
  const schema = Joi.object({
    type: Joi.string().valid('income', 'expense').required().messages({
      'any.required': 'Le type est requis',
      'any.only': 'Le type doit être "income" ou "expense"',
    }),
    amount: Joi.number()
      .positive()
      .max(VALIDATION_RULES.MAX_AMOUNT)
      .required()
      .messages({
        'number.positive': ERROR_MESSAGES.INVALID_AMOUNT,
        'any.required': 'Le montant est requis',
      }),
    category: Joi.string().optional().allow('', null),
    frequency: Joi.string()
      .valid(...Object.values(FREQUENCIES))
      .optional()
      .default('once'),
    description: Joi.string().max(VALIDATION_RULES.MAX_DESCRIPTION_LENGTH).optional().allow(''),
    date: Joi.date().required().messages({
      'any.required': 'La date est requise',
    }),
  });
  return schema.validate(data, { abortEarly: false });
};

export const validateBudgetLimit = (data) => {
  const schema = Joi.object({
    monthlyLimit: Joi.number()
      .positive()
      .max(VALIDATION_RULES.MAX_AMOUNT)
      .required()
      .messages({
        'number.positive': 'Le budget doit être positif',
        'any.required': 'Le budget mensuel est requis',
      }),
  });
  return schema.validate(data, { abortEarly: false });
};

export const isValidAmount = (amount) => {
  return typeof amount === 'number' && amount > 0 && amount <= VALIDATION_RULES.MAX_AMOUNT;
};

export const isValidCategory = (category) => {
  return !!category && category.length > 0;
};

export const formatValidationErrors = (details) => {
  const errors = {};
  details.forEach((detail) => {
    errors[detail.path[0]] = detail.message;
  });
  return errors;
};
