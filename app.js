const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { celebrate } = require('celebrate');

const app = express();
const { PORT = 3000 } = process.env;
const mongoose = require('mongoose');
const { errors } = require('celebrate');

const { userRouter, userValidationSchema } = require('./routes/users');
const cardRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
mongoose.connect('mongodb://localhost:27017/mestodb ');

app.use(express.json());
app.use(helmet());
app.use(limiter);
app.post('/signup', celebrate({
  body: userValidationSchema,
}), createUser);
app.post('/signin', celebrate({
  body: userValidationSchema,
}), login);
app.use(auth);
app.use(userRouter);
app.use(cardRouter);
app.use(errors());
app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((error) => error.message).join('; ');
    res.status(400).send({ message });
  } else if (err.code === 11000) {
    res.status(409).send({ message: 'Email уже зарегистрирован' });
  }
  res.status(err.statusCode).send({ message: err.message });
  next();
});
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    message: error.message,
  });
  next();
});

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
