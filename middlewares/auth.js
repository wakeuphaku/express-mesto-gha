const jwt = require('jsonwebtoken');

const AUTH_ERROR = 401;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new AUTH_ERROR('Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'key');
  } catch (err) {
    return next(new AUTH_ERROR('Необходима авторизация'));
  }

  req.user = payload;
  return next();
};
