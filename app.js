const express = require('express');

const { errors } = require('celebrate');

const {
  celebrate,
  Joi,
} = require('celebrate');

const { PORT = 3000 } = process.env;

const mongoose = require('mongoose');

const NotFoundError = require('./errors/NotFoundError');

const {
  createUsers,
  login,
} = require('./controllers/users');

const auth = require('./middlewares/auth');

const regex = /^https?:\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\\/~+#-]*[\w@?^=%&\\/~+#-])/im;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  autoIndex: true,
});

const app = express();

app.use(express.json());

app.post(
  '/signin',
  celebrate({
    body: Joi.object()
      .keys({
        email: Joi.string()
          .required()
          .email(),
        password: Joi.string()
          .required(),
      }),
  }),
  login,
);
app.post('/signup', celebrate({
  body: Joi.object()
    .keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().pattern(regex),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(2),
    }),
}), createUsers);

app.use(auth);

app.use('/users', require('./routes/users'));

app.use('/cards', require('./routes/cards'));

app.use((req, res, next) => {
  next(new NotFoundError('Что то не так'));
});

app.use(errors());

app.use((err, req, res, next) => {
  const {
    statusCode = 500,
    message,
  } = err;
  res.status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT);
