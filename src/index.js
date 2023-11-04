require('dotenv').config()

const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', (error) => console.log('MongoDB connection error:' + error));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.use(express.json())

const usersRouter = require('./routes/users')
app.use('/users', usersRouter)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});