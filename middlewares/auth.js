const token = require('jsonwebtoken');
const AuthorizeError = require('../errors/AuthorizeError');

module.exports = (req, res, next) => {
  const { jwt } = req.cookies;
  if (!jwt) {
    throw new AuthorizeError('1Необходима авторизация');
  }
  // const token = Authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = token.verify(jwt, 'some-secret-key');
  } catch (err) {
    throw new AuthorizeError('2Необходима авторизация');
  }
  req.user = payload;
  next();
};
