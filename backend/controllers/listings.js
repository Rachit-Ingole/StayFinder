const HomeListing = require("../models/HomeListing");
const ServiceListing = require("../models/ServiceListing");
require('dotenv').config();


const listHome = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      pricing,
      images,
      home
    } = req.body;

    // Validation
    if (!title || !description || !location?.city || !pricing?.basePrice) {
      return res.status(400).json({
        success: false,
        message: 'Required fields missing: title, description, city, and base price are required'
      });
    }

    // Create new home listing
    const homeListingData = {
      type: 'home',
      title: title.trim(),
      description: description.trim(),
      location: {
        address: location.address?.trim() || '',
        city: location.city.trim(),
        state: location.state?.trim() || '',
        zipCode: location.zipCode?.trim() || '',
        country: location.country?.trim() || '',
        coordinates: {
          lat: location.coordinates?.lat || '',
          lng: location.coordinates?.lng || ''
        }
      },
      pricing: {
        basePrice: Number(pricing.basePrice),
        currency: pricing.currency || 'INR'
      },
      images: images || [],
      home: {
        placeType: home?.placeType?.trim() || '',
        propertyType: home?.propertyType?.trim() || '',
        guests: Number(home?.guests) || 0,
        bedrooms: Number(home?.bedrooms) || 0,
        beds: Number(home?.beds) || 0,
        bathrooms: Number(home?.bathrooms) || 0,
        amenities: home?.amenities || [],
        houseRules: {
          pets: home?.houseRules?.pets?.trim() || '',
          smoking: home?.houseRules?.smoking?.trim() || '',
          checkIn: home?.houseRules?.checkIn?.trim() || '',
          checkOut: home?.houseRules?.checkOut?.trim() || '',
          additionalRules: home?.houseRules?.additionalRules?.trim() || ''
        },
        fees: {
          cleaningFee: Number(home?.fees?.cleaningFee) || 0,
          serviceFee: Number(home?.fees?.serviceFee) || 0
        },
        cancellationPolicy: home?.cancellationPolicy?.trim() || ''
      }
    };

    const newHomeListing = new HomeListing(homeListingData);
    const savedListing = await newHomeListing.save();

    res.status(201).json({
      success: true,
      message: 'Home listing created successfully',
      data: savedListing
    });

  } catch (error) {
    console.error('Error creating home listing:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error while creating home listing'
    });
  }
}

const listService = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      pricing,
      images,
      service
    } = req.body;

    // Validation
    if (!title || !description || !location?.city || !pricing?.basePrice) {
      return res.status(400).json({
        success: false,
        message: 'Required fields missing: title, description, city, and base price are required'
      });
    }

    // Create new service listing
    const serviceListingData = {
      type: 'service',
      title: title.trim(),
      description: description.trim(),
      location: {
        address: location.address?.trim() || '',
        city: location.city.trim(),
        state: location.state?.trim() || '',
        zipCode: location.zipCode?.trim() || '',
        country: location.country?.trim() || '',
        coordinates: {
          lat: location.coordinates?.lat || '',
          lng: location.coordinates?.lng || ''
        }
      },
      pricing: {
        basePrice: Number(pricing.basePrice),
        currency: pricing.currency || 'INR'
      },
      images: images || [],
      service: {
        serviceType: service?.serviceType?.trim() || '',
        category: service?.category?.trim() || '',
        duration: service?.duration?.trim() || '',
        groupSize: service?.groupSize?.trim() || '',
        includes: service?.includes || [],
        requirements: service?.requirements?.trim() || '',
        availability: {
          days: service?.availability?.days || [],
          timeSlots: service?.availability?.timeSlots || []
        }
      }
    };

    const newServiceListing = new ServiceListing(serviceListingData);
    const savedListing = await newServiceListing.save();

    res.status(201).json({
      success: true,
      message: 'Service listing created successfully',
      data: savedListing
    });

  } catch (error) {
    console.error('Error creating service listing:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error while creating service listing'
    });
  }
}

const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid service listing ID format'
      });
    }

    const service = await ServiceListing.findById(id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service listing not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Service listing retrieved successfully',
      data: service
    });

  } catch (error) {
    console.error('Error fetching service listing:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching service listing'
    });
  }
}

const getHomeById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid home listing ID format'
      });
    }

    const home = await HomeListing.findById(id);

    if (!home) {
      return res.status(404).json({
        success: false,
        message: 'Home listing not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Home listing retrieved successfully',
      data: home
    });

  } catch (error) {
    console.error('Error fetching home listing:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching home listing'
    });
  }
}

const getAllServices = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      city,
      state,
      country,
      minPrice,
      maxPrice,
      serviceType,
      category,
      duration
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (city) filter['location.city'] = new RegExp(city, 'i');
    if (state) filter['location.state'] = new RegExp(state, 'i');
    if (country) filter['location.country'] = new RegExp(country, 'i');
    if (minPrice || maxPrice) {
      filter['pricing.basePrice'] = {};
      if (minPrice) filter['pricing.basePrice'].$gte = Number(minPrice);
      if (maxPrice) filter['pricing.basePrice'].$lte = Number(maxPrice);
    }
    if (serviceType) filter['service.serviceType'] = new RegExp(serviceType, 'i');
    if (category) filter['service.category'] = new RegExp(category, 'i');
    if (duration) filter['service.duration'] = new RegExp(duration, 'i');

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const services = await ServiceListing.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const totalServices = await ServiceListing.countDocuments(filter);
    const totalPages = Math.ceil(totalServices / limitNum);

    res.status(200).json({
      success: true,
      message: 'Service listings retrieved successfully',
      data: {
        services,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalItems: totalServices,
          itemsPerPage: limitNum,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1
        }
      }
    });

  } catch (error) {
    console.error('Error fetching service listings:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching service listings'
    });
  }
}

const getAllHomes =  async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      city,
      state,
      country,
      minPrice,
      maxPrice,
      guests,
      bedrooms,
      propertyType,
      amenities
    } = req.query;

    const filter = {};
    
    if (city) filter['location.city'] = new RegExp(city, 'i');
    if (state) filter['location.state'] = new RegExp(state, 'i');
    if (country) filter['location.country'] = new RegExp(country, 'i');
    if (minPrice || maxPrice) {
      filter['pricing.basePrice'] = {};
      if (minPrice) filter['pricing.basePrice'].$gte = Number(minPrice);
      if (maxPrice) filter['pricing.basePrice'].$lte = Number(maxPrice);
    }
    if (guests) filter['home.guests'] = { $gte: Number(guests) };
    if (bedrooms) filter['home.bedrooms'] = { $gte: Number(bedrooms) };
    if (propertyType) filter['home.propertyType'] = new RegExp(propertyType, 'i');
    if (amenities) {
      const amenitiesArray = amenities.split(',').map(a => a.trim());
      filter['home.amenities'] = { $in: amenitiesArray };
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const homes = await HomeListing.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const totalHomes = await HomeListing.countDocuments(filter);
    const totalPages = Math.ceil(totalHomes / limitNum);

    res.status(200).json({
      success: true,
      message: 'Home listings retrieved successfully',
      data: {
        homes,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalItems: totalHomes,
          itemsPerPage: limitNum,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1
        }
      }
    });

  } catch (error) {
    console.error('Error fetching home listings:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching home listings'
    });
  }
}


module.exports = {
  listHome,
  listService,
  getServiceById,
  getHomeById,
  getAllServices,
  getAllHomes
};