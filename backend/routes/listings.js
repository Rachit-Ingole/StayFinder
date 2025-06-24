const express = require('express');
const router = express.Router();
const HomeListing = require('../models/HomeListing'); // Adjust path as needed
const ServiceListing = require('../models/ServiceListing'); // Adjust path as needed
const { listHome,listService, getServiceById, getHomeById, getAllServices, getAllHomes } = require('../controllers/listings');

router.post('/list-home', listHome);
router.post('/list-service', listService);
router.get('/get-homes',getAllHomes);
router.get('/get-services', getAllServices);
router.get('/get-home/:id', getHomeById);
router.get('/get-service/:id', getServiceById);

module.exports = router;