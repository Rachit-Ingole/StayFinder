const express = require('express')
const router = express.Router()
const cors = require('cors');
router.use(cors());

const { getQuote,getBackground } = require('../controllers/others')

router.get('/quote', getQuote)
router.get('/background',getBackground)
module.exports = router
