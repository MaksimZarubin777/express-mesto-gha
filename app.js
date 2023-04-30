const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { celebrate } = require('celebrate');

const app = express();
const { PORT = 3000 } = process.env;
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const limiter = require('./limiter');
const { userRouter, userValidationSchema } = require('./routes/users');
const cardRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/NotFoundError');
const errorsHandler = require('./middlewares/errorsHandler');

mongoose.connect('mongodb://localhost:27017/mestodb ');

app.use(express.json());
app.use(helmet());
app.use(limiter);
app.use(cookieParser());
app.post('/signup', celebrate({
  body: userValidationSchema,
}), createUser);
app.post('/signin', celebrate({
  body: userValidationSchema,
}), login);
app.use(auth);
app.use(userRouter);
app.use(cardRouter);
app.use((req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});
app.use(errors());
app.use(errorsHandler);
// app.use((error, req, res, next) => {
//   res.status(error.status || 500);
//   res.json({
//     message: error.message,
//   });
//   next();
// });

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
