const express = require('express');
const { celebrate, Joi } = require('celebrate');
const { REG_EXP } = require('../constants');

const userValidationSchema = Joi.object().keys({
  name: Joi.string().min(2).max(30),
  about: Joi.string().min(2).max(30),
  avatar: Joi.string().pattern(REG_EXP),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
const userUpdateValidationSchema = Joi.object().keys({
  name: Joi.string().min(2).max(30),
  about: Joi.string().min(2).max(30),
});
const userAvatarValidationSchema = Joi.object().keys({
  avatar: Joi.string().pattern(REG_EXP),
});
const idValidationSchema = Joi.object({
  id: Joi.string().hex().length(24),
});

const userRouter = express.Router();
const {
  getUsers,
  getUser,
  updateUser,
  updateAvatar,
  getMe,
} = require('../controllers/users');

userRouter.get('/users', getUsers);
userRouter.get('/users/me', getMe);
userRouter.get('/users/:id', celebrate({
  params: idValidationSchema,
}), getUser);
userRouter.patch('/users/me', celebrate({
  body: userUpdateValidationSchema,
}), updateUser);
userRouter.patch('/users/me/avatar', celebrate({
  body: userAvatarValidationSchema,
}), updateAvatar);

module.exports = { userRouter, userValidationSchema };
