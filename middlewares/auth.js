const token = require('jsonwebtoken');
const { AuthorizeError } = require('../errors/index');

module.exports = (req, res, next) => {
  const { jwt } = req.cookies;
  if (!jwt) {
    throw new AuthorizeError('Необходима авторизация');
  }
  let payload;
  try {
    payload = token.verify(jwt, 'some-secret-key');
  } catch (err) {
    throw new AuthorizeError('Необходима авторизация');
  }
  req.user = payload;
  next();
};
