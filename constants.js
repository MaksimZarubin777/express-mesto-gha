module.exports = {
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
  CREATED: 201,
  REG_EXP: /^(https?:\/\/)(www\.)?[a-zA-Z0-9-]{1,}(\.[a-zA-Z]{1,})([a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]{1,})?/i,
};
