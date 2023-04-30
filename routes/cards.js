const express = require('express');
const { celebrate, Joi } = require('celebrate');

const cardValidationRegEx = /^(https?:\/\/)(www\.)?[a-z0-9-._~:/?#[\]@!$&'()*+,;=]+#?$/i;
const cardValidationSchema = Joi.object().keys({
  name: Joi.string().required().min(2).max(30),
  link: Joi.string().required().pattern(cardValidationRegEx),
});
const cardIdValidationSchema = Joi.object({
  id: Joi.string().hex().length(24),
});
const cardRouter = express.Router();
const {
  getCards,
  createCard,
  deleteCard,
  addCardLike,
  removeCardLike,
} = require('../controllers/cards');

cardRouter.get('/cards', getCards);
cardRouter.post('/cards', celebrate({ body: cardValidationSchema }), createCard);
cardRouter.delete('/cards/:cardId', celebrate({ body: cardIdValidationSchema }), deleteCard);
cardRouter.put('/cards/:cardId/likes', celebrate({ body: cardIdValidationSchema }), addCardLike);
cardRouter.delete('/cards/:cardId/likes', celebrate({ body: cardIdValidationSchema }), removeCardLike);

module.exports = cardRouter;
