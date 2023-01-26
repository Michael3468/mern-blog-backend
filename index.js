import * as dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';

import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';

import { registerValidation, loginValidation, postCreateValidation } from './validations.js';

import { UserController, PostController } from './controllers/index.js';

import { checkAuth, handleValidationErrors } from './utils/index.js';

// server init +
const DB_NAME = 'blog';

mongoose
  .set('strictQuery', false)
  .connect(
    `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.b13o4kt.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`,
  )
  .then(() => console.log('DataBase connect:..[Ok]'))
  .catch((err) => console.log('DataBase connect error: ', err));

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads');
    }
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads')); // use static folder 'uploads'

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log('Server started:....[OK]');
});
// server init -

// server test +
app.get('/', (req, res) => {
  res.send('Hello world');
});
// server test -

app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get('/tags', PostController.getLastTags);
app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch(
  '/posts/:id',
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.update,
);
