import express from 'express';
import mongoose from 'mongoose';

import { registerValidation, loginValidation, postCreateValidation } from './validations.js';

import checkAuth from './utils/checkAuth.js';

import * as UserController from './controllers/UserController.js';
import * as PostController from './controllers/PostController.js';

// server init +
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
// server init -

// server test +
app.get('/', (req, res) => {
  res.send('Hello world');
});
// server test -

app.post('/auth/register', registerValidation, UserController.register);
app.post('/auth/login', loginValidation, UserController.login);
app.get('/auth/me', checkAuth, UserController.getMe);

app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, PostController.create);
// app.delete('/posts', PostController.remove);
// app.patch('/posts', PostController.update);
