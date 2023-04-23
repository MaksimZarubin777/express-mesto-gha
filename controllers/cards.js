const mongoose  = require('mongoose');
const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find()
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch(() => {
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => {
      res.status(201).send({ data: card });
    })
    .catch((e) => {
      if (e.name === 'ValidationError') {
        const message = Object.values(e.errors).map((error) => error.message).join('; ');
        res.status(400).send({ message });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then((card) => {
      res.send({ data: card });
    })
    .catch((e) => {
      if (e === 'CastError') {
        const message = Object.values(e.errors).map((error) => error.message).join('; ');
        res.status(404).send({ message });
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

const addCardLike = (req, res) => {
  const { cardId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    return res.status(400).send({ message: 'Неккоректный идентификатор карточки' });
  }
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Card not found' });
      }
      return res.send({ data: card });
    })
    .catch(() => {
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

const removeCardLike = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((e) => {
      if (e.name === 'ValidationError') {
        const message = Object.values(e.errors).map((error) => error.message).join('; ');
        res.status(400).send({ message });
      }
      if (e.name === 'CastError') {
        res.status(404).send({ message: 'Card not found' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addCardLike,
  removeCardLike,
};
