const jwt = require('jsonwebtoken');
const AuthorizeError = require('../errors/AuthorizeError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthorizeError('Необходима авторизация');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    throw new AuthorizeError('Необходима авторизация');
  }
  req.user = payload;
  next();
};
