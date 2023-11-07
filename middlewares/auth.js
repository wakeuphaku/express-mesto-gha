const jwt = require('jsonwebtoken');
const AuthError = require('../errors/AuthError');

const extractBearerToken = (header) => header.replace('Bearer ', '');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new AuthError('Authorization is required'));
  }
  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt(token);
  } catch (err) {
    return next(new AuthError('Authorization is required'));
  }

  req.user = payload;
  return next();
};

module.exports = auth;
