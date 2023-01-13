import bcrypt from 'bcrypt';
import express from 'express';
import mongoose from 'mongoose';
import { validationResult } from 'express-validator';

import { registerValidation } from './validations/auth.js';

import UserModel from './models/User.js';

mongoose
  .set('strictQuery', false)
  .connect(
    'mongodb+srv://user432654:D2da5Hsg9Iu43F8mf@cluster0.b13o4kt.mongodb.net/blog?retryWrites=true&w=majority'
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

// server test +
app.get('/', (req, res) => {
  res.send('Hello world');
});
// server test -

app.post('/auth/register', registerValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }
  
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
  
    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash,
    })
  
    const user = await doc.save();

    res.json(user);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: 'Не удалось зарегистрироваться',
    })
  }
});

