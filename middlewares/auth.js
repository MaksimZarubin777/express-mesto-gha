const jwt = require('jsonwebtoken');
const AuthorizeError = require('../errors/AuthorizeError');

module.exports = (req, res, next) => {
  const { Authorization } = req.headers;
  if (!Authorization || !Authorization.startsWith('Bearer ')) {
    throw new AuthorizeError(`111 ${req.headers.Authorization}`);
  }
  const token = Authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    throw new AuthorizeError('2Необходима авторизация');
  }
  req.user = payload;
  next();
};
