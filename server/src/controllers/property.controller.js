import * as propertyService from '../services/property.service.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const createProperty = async (req, res, next) => {
  try {
    const property = await propertyService.createProperty(req.body, req.user);
    return sendSuccess(res, 201, 'Property created successfully', property);
  } catch (error) {
    next(error);
  }
};

export const getProperties = async (req, res, next) => {
  try {
    const properties = await propertyService.searchProperties(req.query);
    return sendSuccess(res, 200, 'Properties retrieved successfully', properties, { total: properties.length });
  } catch (error) {
    next(error);
  }
};

export const getNearbyProperties = async (req, res, next) => {
  try {
    const { latitude, longitude, radius } = req.query;
    if (!latitude || !longitude) {
      return res.status(400).json({ success: false, message: 'Latitude and longitude parameters are required' });
    }
    const properties = await propertyService.getNearbyProperties(latitude, longitude, radius);
    return sendSuccess(res, 200, 'Nearby properties retrieved successfully', properties, { total: properties.length });
  } catch (error) {
    next(error);
  }
};

export const getPropertyById = async (req, res, next) => {
  try {
    const property = await propertyService.getPropertyById(req.params.id);
    return sendSuccess(res, 200, 'Property details retrieved successfully', property);
  } catch (error) {
    next(error);
  }
};

export const updatePropertyStatus = async (req, res, next) => {
  try {
    const property = await propertyService.updatePropertyStatus(req.params.id, req.body, req.user);
    return sendSuccess(res, 200, 'Property status updated successfully', property);
  } catch (error) {
    next(error);
  }
};

export const confirmAvailability = async (req, res, next) => {
  try {
    const property = await propertyService.confirmAvailability(req.params.id, req.user);
    return sendSuccess(res, 200, 'Property availability reconfirmed successfully', property);
  } catch (error) {
    next(error);
  }
};

export const compareProperties = async (req, res, next) => {
  try {
    const { ids } = req.query;
    if (!ids) {
      return res.status(400).json({ success: false, message: 'Comma-separated property ids query parameter required' });
    }
    const idsArray = ids.split(',').map(id => id.trim());
    const properties = await propertyService.compareProperties(idsArray);
    return sendSuccess(res, 200, 'Properties retrieved for comparison', properties);
  } catch (error) {
    next(error);
  }
};
