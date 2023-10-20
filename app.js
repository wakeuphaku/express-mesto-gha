const express = require('express');

const { PORT = 3000 } = process.env;

const mongoose = require('mongoose');
const UserModel = require('./models/user');

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

app.get('/', (req, res) => {
  res.send('BackEnd');
});

app.post('/users', (req, res) => {
  const userData = req.body;
  console.log(req.body);

  return UserModel.create(userData)
    .then((data) => res.status(201)
      .send(data))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400)
          .send({ message: err.message });
      }
      return res.status(500)
        .send({ message: 'Server Error' });
    });
});

app.listen(PORT, () => {
  // console.log(`App listening port ${PORT}`);
});
