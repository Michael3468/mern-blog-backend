import express from 'express';
import jwt from 'jsonwebtoken';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello world');
});

app.post('/auth/login', (req, res) => {
  /**
   * 'req' in this case, json sended wia postman from 'Body - json'
   * {
   *   "email": "test@test.ru",
   *   "password": "12345"
   * }
   *
   */
  console.log(req.body);

  const encryptionString = 'RandomStringToEncryptToken_12345';

  // encrypt to 'token' fields: email and fullName
  const token = jwt.sign(
    {
      email: req.body.email,
      fullName: 'Василий Пупкин',
    },
    encryptionString
  );

  res.json({
    success: true,
    token,
  });
});

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log('Server started: OK');
});
