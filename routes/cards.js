const express = require('express');

const cardRouter = express.Router();
const {
  getCards,
  createCard,
  deleteCard,
  addCardLike,
  removeCardLike,
} = require('../controllers/cards');

cardRouter.get('/cards', getCards);
cardRouter.post('/cards', createCard);
cardRouter.delete('/cards/:cardId', deleteCard);
cardRouter.put('/cards/:cardId/likes', addCardLike);
cardRouter.delete('/cards/:cardId/likes', removeCardLike);

module.exports = cardRouter;
