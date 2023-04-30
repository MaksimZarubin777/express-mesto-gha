const BadRequestError = require('./BadRequestError');
const NotFoundError = require('./NotFoundError');
const ForbiddenError = require('./ForbiddenError');
const AuthorizeError = require('./AuthorizeError');
const ConflictError = require('./ConflictError');
const ServerError = require('./ServerError');

module.exports = {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
  AuthorizeError,
  ConflictError,
  ServerError,
};
