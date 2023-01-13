import express from 'express';
import mongoose from 'mongoose';

import { registerValidation } from './validations/auth.js';

import checkAuth from './utils/checkAuth.js';

import * as UserController from './controllers/UserController.js';

// init server +
mongoose
  .set('strictQuery', false)
  .connect(
    'mongodb+srv://user432654:D2da5Hsg9Iu43F8mf@cluster0.b13o4kt.mongodb.net/blog?retryWrites=true&w=majority',
  )
  .then(() => console.log('DataBase: Ok'))
  .catch((err) => console.log('DataBase error: ', err));

const app = express();

app.use(express.json());

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log('Server started: OK');
});
// init server -

// server test +
app.get('/', (req, res) => {
  res.send('Hello world');
});
// server test -

app.post('/auth/register', registerValidation, UserController.register);
app.post('/auth/login', UserController.login);
app.get('/auth/me', checkAuth, UserController.getMe);
