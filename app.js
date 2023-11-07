const express = require('express');

const { PORT = 3000 } = process.env;

const mongoose = require('mongoose');

const NOT_FOUND = 404;

const { createUsers, login } = require('./controllers/users');

const auth = require('./middlewares/auth');

const {
  validationCreateUser,
  validationLogin,
} = require('./middlewares/validations');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

const app = express();

app.use(express.json());

app.post('/signin', validationLogin, login);
app.post('/signup', validationCreateUser, createUsers);

app.use(auth);

app.use('/users', require('./routes/users'));

app.use('/cards', require('./routes/cards'));

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
  next();
});

app.use((req, res) => {
  res.status(NOT_FOUND).send({ message: 'Что то не так!' });
});

app.listen(PORT);
