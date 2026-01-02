import express from 'express';
import connectDataBase from './src/database/db.js'; 
import userRoute from './src/routes/user.route.js';
import dotenv from 'dotenv';

const app = express();
const port = 3000;
dotenv.config();

app.get('/', (req, res) => {
  res.send('Hello World!')
})

connectDataBase();

app.use(express.json());
app.use('/user', userRoute);

app.listen(port);