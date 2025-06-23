require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();
app.use(express.json());

const cors = require('cors');

app.use(cors({
  origin: process.env.FRONTEND_URL, // Allow your frontend
  credentials: true            
}));


const connectDB = require('./db/connect');
const authenticateUser = require('./middleware/auth');

const authRouter = require('./routes/auth');

// const mainRouter = require('./routes/main');
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');


app.use('/api/v1/auth', authRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


const port = process.env.PORT || 8000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();