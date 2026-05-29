import Joi from 'joi';

export const updateProfileSchema = Joi.object({
  firstName: Joi.string().max(50).allow('', null),
  lastName: Joi.string().max(50).allow('', null),
  bio: Joi.string().max(500).allow('', null),
  location: Joi.string().max(100).allow('', null),
  skills: Joi.array().items(Joi.string().max(30)).max(20).default([]),
  languages: Joi.array().items(Joi.string().max(30)).max(10).default([]),
  website: Joi.string().uri().allow('', null),
  phone: Joi.string().max(20).allow('', null),
});
