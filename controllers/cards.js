const mongoose = require('mongoose');
const Card = require('../models/card');
const BadRequest = require('../errors/BadRequest');
const AccesError = require('../errors/AccesError');
const NotFoundError = require('../errors/NotFoundError');

const ERROR_CODE = 400;
const NOT_FOUND = 404;
const DEFAULT_ERROR = 500;
const CREATED = 201;

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch(() => {
      res.status(DEFAULT_ERROR)
        .send({ message: 'Что то тут не так!' });
    });
};

module.exports.createCards = (req, res, next) => {
  const {
    name,
    link,
  } = req.body;

  Card.create({
    name,
    link,
    owner: req.user._id,
  })
    .then((card) => res.status(CREATED)
      .send({ card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequest('Некорректные данные'));
      }
      return next(err);
    });
};

module.exports.deleteCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndRemove(req.params.cardId);
    if (!card) {
      next(new NotFoundError('Карточка не найдена '));
      return;
    }
    if (card.owner.toString() !== req.user._id.toString()) {
      throw new AccesError('Нет прав');
    }
    res.status(200).send(card);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      next(new BadRequest('Некорректные данные'));
    }
    next(err);
  }
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND)
          .send({ message: 'Карточка не найдена ' });
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(NOT_FOUND)
          .send({ message: 'Некорректные данные' });
      } else if (err.name === 'CastError') {
        res.status(ERROR_CODE)
          .send({ message: 'Карточка не найдена ' });
      } else {
        res.status(DEFAULT_ERROR)
          .send({ message: 'Что то тут не так!' });
      }
    });
};

module.exports.unlikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND)
          .send({ message: 'Карточка не найдена ' });
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE)
          .send({ message: 'Некорректные данные' });
      } else if (err.name === 'CastError') {
        res.status(ERROR_CODE)
          .send({ message: 'Карточка не найдена ' });
      } else {
        res.status(NOT_FOUND)
          .send({ message: 'Что то тут не так!' });
      }
    });
};
