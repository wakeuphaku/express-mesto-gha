const mongoose = require('mongoose');
const Card = require('../models/card');
const BadRequest = require('../errors/BadRequest');
const AccesError = require('../errors/AccesError');
const NotFoundError = require('../errors/NotFoundError');
const BadInfoError = require('../errors/BadInfoError');

const CREATED = 201;

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch((next) => {
      next(new BadInfoError('Некорректные данные'));
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
        return next(new BadRequest('Некорректные данные'));
      }
      return next(err);
    });
};

// eslint-disable-next-line consistent-return
module.exports.deleteCard = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.cardId);
    if (!card) {
      next(new NotFoundError('Карточка не найдена '));
    }
    if (card.owner.toString() !== req.user._id.toString()) {
      throw new AccesError('Нет прав');
    }
    card.deleteOne()
      .then(() => res.status(200).send(card))
      .catch(next);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      return next(new BadRequest('Некорректные данные'));
    }
    next(err);
  }
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Некорректные данные'));
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Некорректные данные'));
      } else if (err.name === 'CastError') {
        next(new BadRequest('Некорректные данные'));
      } else {
        next(new BadInfoError('Что то не так'));
      }
    });
};

module.exports.unlikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Некорректные данные'));
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Некорректные данные'));
      } else if (err.name === 'CastError') {
        next(new BadRequest('Некорректные данные'));
      } else {
        next(new BadInfoError('Что то не так'));
      }
    });
};
