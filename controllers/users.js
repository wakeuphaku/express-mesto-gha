const User = require('../models/user');

const ERROR_CODE = 400;
const NOT_FOUND = 404;
const DEFAULT_ERROR = 500;
const CREATED = 201;

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch(() => {
      res.status(DEFAULT_ERROR)
        .send({ message: 'Что то не так!' });
    });
};

module.exports.createUsers = (req, res) => {
  const {
    name,
    about,
    avatar,
  } = req.body;

  User.create({
    name,
    about,
    avatar,
  })
    .then((user) => res.status(CREATED)
      .send({ data: user }))
    .catch((err) => {
      if (err.name === 'SomeErrorName') {
        res.status(ERROR_CODE)
          .send({ message: 'Некорректные данные' });
      } else {
        res.status(DEFAULT_ERROR)
          .send({ message: 'Что то не так!' });
      }
    });
};

module.exports.getUserId = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'SomeErrorName') {
        res.status(NOT_FOUND)
          .send({ message: 'Пользователь не найден' });
      } else {
        res.status(DEFAULT_ERROR)
          .send({ message: 'Что то не так!' });
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
  )
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'SomeErrorName') {
        res.status(ERROR_CODE)
          .send({ message: 'Некорректные данные' });
      } else if (err.name === 'SomeError') {
        res.status(NOT_FOUND)
          .send({ message: 'Пользователь не найден' });
      } else {
        res.status(DEFAULT_ERROR)
          .send({ message: 'Что то не так!' });
      }
    });
};

module.exports.patchAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'SomeErrorName') {
        res.status(ERROR_CODE)
          .send({ message: 'Некорректные данные' });
      } else if (err.name === 'SomeError') {
        res.status(NOT_FOUND)
          .send({ message: 'Пользователь не найден' });
      } else {
        res.status(DEFAULT_ERROR)
          .send({ message: 'Что то не так!' });
      }
    });
};
