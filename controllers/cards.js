const mongoose = require('mongoose');
const Card = require('../models/card');
const { CREATED } = require('../constants');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');

const getCards = (req, res, next) => {
  Card.find()
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => {
      res.status(CREATED).send({ data: card });
    })
    .catch(next);
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    throw new BadRequestError('Некорректный идентификатор карточки');
  }
  return Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Card not found');
      }
      if (String(card.owner) !== userId) {
        throw new ConflictError('Вы не можете удалить чужую карточку');
      }
      return Card.findByIdAndRemove(cardId)
        .then((removingCard) => res.send({ data: removingCard }))
        .catch(next);
    })
    .catch(next);
};

const addCardLike = (req, res, next) => {
  const { cardId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    throw new BadRequestError('Некорректный идентификатор карточки');
  }
  return Card.findByIdAndUpdate(cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Card not found');
      }
      return res.send({ data: card });
    })
    .catch(next);
};

const removeCardLike = (req, res, next) => {
  const { cardId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    throw new BadRequestError('Некорректный идентификатор карточки');
  }
  return Card.findByIdAndUpdate(cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Card not found');
      }
      return res.send({ data: card });
    })
    .catch(next);
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addCardLike,
  removeCardLike,
};
