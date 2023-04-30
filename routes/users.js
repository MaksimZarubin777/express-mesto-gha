const express = require('express');
const { celebrate, Joi } = require('celebrate');

const avatarValidationRegEx = /^(https?:\/\/)(www\.)?[a-z0-9-._~:/?#[\]@!$&'()*+,;=]+#?$/i;
const userValidationSchema = Joi.object().keys({
  name: Joi.string().min(2).max(30),
  about: Joi.string().min(2).max(30),
  avatar: Joi.string().pattern(avatarValidationRegEx),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
const idValidationSchema = Joi.object({
  _id: Joi.string().hex().length(24),
})

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
  body: userValidationSchema,
}), updateUser);
userRouter.patch('/users/me/avatar', celebrate({
  body: userValidationSchema,
}), updateAvatar);

module.exports = { userRouter, userValidationSchema };
