import * as dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';

import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';

import { registerValidation, loginValidation, postCreateValidation } from './validations.js';

import { UserController, PostController, CommentController } from './controllers/index.js';

import { checkAuth, handleValidationErrors } from './utils/index.js';

// server init +
mongoose
  .set('strictQuery', false)
  .connect(process.env.MONGO_URI)
  .then(() => console.log('DataBase connect:..[Ok]'))
  .catch((err) => console.log('DataBase connect error: ', err));

const app = express();

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

// server test (can be deleted) +
app.get('/', (req, res) => {
  res.send('Hello world');
});
// server test (can be deleted) -

// upload files to server +
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
// upload files to server -

app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});
app.get('/tags', PostController.getLastTags);
app.get('/posts', PostController.getAllSortedByDate);
app.get('/popular-posts', PostController.getAllSortedByPopularity);
app.get('/posts/:id', PostController.getOne);
app.get('/tags/:tagname', PostController.getAllWithTagByDate);
app.get('/post-comments/:id', CommentController.getCommentsByPostId);
app.get('/last-comments', CommentController.getLastComments);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.post('/comment-create', checkAuth, CommentController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.delete('/post-comments-remove/:id', CommentController.removePostComments);
app.patch(
  '/posts/:id',
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.update,
);
