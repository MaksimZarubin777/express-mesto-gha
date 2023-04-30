const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { CREATED } = require('../constants');
const { BadRequestError, NotFoundError, ConflictError } = require('../errors/index');

const getUsers = (req, res, next) => {
  User.find()
    .then((users) => {
      res.send({ data: users });
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  const { id } = req.params;
  User.findById(id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('User not found');
      }
      return res.send({ data: user });
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => {
      res.status(CREATED).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Некорректные данные при создании пользователя'));
      } else if (err.code === 11000) {
        next(new ConflictError('Email уже зарегистрирован'));
      } else {
        next(err);
      }
    });
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail(new NotFoundError('User not found'))
    .then((user) => res.send({ data: user }))
    .catch(next);
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(new NotFoundError('User not found'))
    .then((userAvatar) => res.send({ data: userAvatar }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Некорректные данные при создании пользователя'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id.toString() }, 'some-secret-key', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000,
        httpOnly: true,
      });
      res.send({ data: user });
    })
    .catch(next);
};

const logOut = (req, res, next) => {
  try {
    res.clearCookie('jwt').send({ message: 'Выход' });
  } catch (err) {
    next(err);
  }
};

const getMe = (req, res, next) => {
  const myId = req.user._id;
  User.findOne({ _id: myId })
    .then((user) => {
      res.send({ data: user });
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
  login,
  getMe,
  logOut,
};
