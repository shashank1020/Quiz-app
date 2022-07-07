import * as Joi from '@hapi/joi';
import { BadRequestException } from '@nestjs/common';

const questionSchema: Joi.Schema = Joi.object().keys({
  questions: Joi.array()
    .items({
      type: Joi.string().required().valid('single', 'multiple'),
      title: Joi.string().required(),
      options: Joi.array().required(),
      correctOptions: Joi.array().required(),
    })
    .required(),
});

export const createQuizSchema: Joi.Schema = questionSchema.append({
  title: Joi.string().required(),
  published: Joi.boolean(),
});

export const updateQuizSchema: Joi.Schema = Joi.object().keys({
  title: Joi.string(),
  questions: Joi.array()
    .items({
      type: Joi.string().required().valid('single', 'multiple'),
      title: Joi.string().required(),
      options: Joi.array().required(),
      correctOptions: Joi.array().required(),
    })
    .allow({}),
  published: Joi.boolean(),
});

export const evaluateSchema: Joi.Schema = Joi.object().keys({
  questions: Joi.array()
    .items({
      type: Joi.string().required().valid('single', 'multiple'),
      title: Joi.string().required(),
      options: Joi.array().required(),
      chosenOptions: Joi.array(),
    })
    .required(),
});

export const loginUserSchema: Joi.Schema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const createUserSchema: Joi.Schema = loginUserSchema.append({
  name: Joi.string().required(),
});

export const joiValidate = (schema: Joi.Schema, object) => {
  const { error } = schema.validate(object);
  if (error) {
    throw new BadRequestException(
      error?.details?.[0].message,
      'Validation failed',
    );
  }
};
