const express = require('express');
const { celebrate, Joi } = require('celebrate');
const { REG_EXP } = require('../constants');

const cardValidationSchema = Joi.object().keys({
  name: Joi.string().required().min(2).max(30),
  link: Joi.string().required().pattern(REG_EXP),
});
const cardIdValidationSchema = Joi.object({
  cardId: Joi.string().hex().length(24),
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
cardRouter.delete('/cards/:cardId', celebrate({ params: cardIdValidationSchema }), deleteCard);
cardRouter.put('/cards/:cardId/likes', celebrate({ params: cardIdValidationSchema }), addCardLike);
cardRouter.delete('/cards/:cardId/likes', celebrate({ params: cardIdValidationSchema }), removeCardLike);

module.exports = cardRouter;
