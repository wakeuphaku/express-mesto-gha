const express = require('express');

const { PORT = 3000 } = process.env;

const mongoose = require('mongoose');

const NOT_FOUND = 404;

const { createUsers, login } = require('./controllers/users');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '6531c3b35d030560fdce9fef', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.post('/signin', login);
app.post('/signup', createUsers);

app.use('/users', require('./routes/users'));

app.use('/cards', require('./routes/cards'));

app.use((req, res) => {
  res.status(NOT_FOUND).send({ message: 'Что то не так!' });
});

app.listen(PORT);
