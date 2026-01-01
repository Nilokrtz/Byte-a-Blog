require('dotenv').config();
const express = require('express')
const userRoute = require('./src/routes/user.route');
const app = express()
const connectDataBase = require('./src/database/db');
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

connectDataBase();

app.use(express.json());
app.use('/user', userRoute);

app.listen(port);