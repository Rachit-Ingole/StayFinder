require('dotenv').config();
require('express-async-errors');

const express = require('express');
const ImageKit = require('imagekit');
const multer = require('multer')
const cors = require('cors');
const fs = require('fs');

const app = express();
const connectDB = require('./db/connect');
const authenticateUser = require('./middleware/auth');
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

const authRouter = require('./routes/auth');
const listingsRouter = require('./routes/listings')
const paymentRoutes = require('./routes/payments');
const bookingsRouter = require('./routes/bookings')

app.use('/api/v1/stripe', require('./routes/stripeWebhook')); 
app.use(express.json());

app.use(cors({
  origin: process.env.FRONTEND_URL, // Allow your frontend
  credentials: true            
}));

// const mainRouter = require('./routes/main');
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.get('/api/v1/check-login', authenticateUser.protect, async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'User is logged in and verified.',
    user: req.user
  });
});

app.use('/api/v1/bookings',authenticateUser.protect,bookingsRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/listings', listingsRouter);
app.use('/api/v1/payment', paymentRoutes);




const upload = multer({ dest: 'uploads/' });

// API to upload image(s)
app.post('/api/v1/upload', upload.array('images'), async (req, res) => {
  try {
    const uploadResults = [];

    for (const file of req.files) {
      const uploadResponse = await imagekit.upload({
        file: fs.readFileSync(file.path), // Buffer
        fileName: file.originalname,
        folder: "/StayFinder", // Optional: folder in ImageKit
      });

      // Clean up temp file
      fs.unlinkSync(file.path);

      uploadResults.push(uploadResponse);
    }
    console.log("SCUESS")
    res.status(200).json({ uploaded: uploadResults });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ error: "Image upload failed" });
  }
});

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