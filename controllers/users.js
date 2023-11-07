const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const BadInfoError = require('../errors/BadInfoError');
const NotFoundError = require('../errors/NotFoundError');
const BadRequest = require('../errors/BadRequest');
const AuthError = require('../errors/AuthError');

const ERROR_CODE = 400;
const NOT_FOUND = 404;
const DEFAULT_ERROR = 500;
const CREATED = 201;

const JWT = 'super-strong-secret';

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(next);
};

module.exports.createUsers = (req, res) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  const passwordHash = bcrypt.hash(password, 10);
  passwordHash.then((hash) => User.create({
    name, about, avatar, email, password: hash,
  }))
    .then(() => res.status(CREATED).send({
      name, about, avatar, email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE)
          .send({ message: 'Некорректные данные' });
      } else {
        res.status(DEFAULT_ERROR)
          .send({ message: 'Что то тут не так!' });
      }
    });
};

module.exports.getUserId = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND)
          .send({ message: 'Пользователь не найден' });
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE)
          .send({ message: 'Пользователь не найден' });
      } else {
        res.status(DEFAULT_ERROR)
          .send({ message: 'Что то тут не так!' });
      }
    });
};

module.exports.patchUsers = (req, res) => {
  const {
    name,
    about,
  } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    {
      name,
      about,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE)
          .send({ message: 'Некорректные данные' });
      } else if (err.name === 'CastError') {
        res.status(NOT_FOUND)
          .send({ message: 'Пользователь не найден' });
      } else {
        res.status(DEFAULT_ERROR)
          .send({ message: 'Что то тут не так!' });
      }
    });
};

module.exports.patchAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    {
      avatar,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь не найен'));
      }
      res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadInfoError('Переданы некорректные данные'));
      }
      return next(err);
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND)
          .send({ message: 'Пользователь не найден' });
      }
      return res.send({ user });
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequest('Переданы некорректные данные'));
      }
      return next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequest('Не передан email или пароль');
  }
  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthError('Такого пользователя не существует');
      }
      return bcrypt.compare(password, user.password)
        .then((correctPassword) => {
          if (!correctPassword) {
            throw new AuthError('Неверный email или пароль');
          }
          const token = jwt.sign({ _id: user._id }, JWT, { expiresIn: '7d' });
          return res.send({ token });
        });
    })
    .catch((err) => {
      next(err);
    });
};
