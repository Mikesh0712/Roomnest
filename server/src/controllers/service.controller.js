import * as serviceService from '../services/service.service.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const getNearbyServices = async (req, res, next) => {
  try {
    const { latitude, longitude, radius, category, city } = req.query;
    const services = await serviceService.searchNearbyServices(latitude, longitude, radius, category, city);
    return sendSuccess(res, 200, 'Nearby services retrieved successfully', services, { total: services.length });
  } catch (error) {
    next(error);
  }
};

export const createService = async (req, res, next) => {
  try {
    const service = await serviceService.createService(req.body, req.user);
    return sendSuccess(res, 201, 'Service provider listing created successfully', service);
  } catch (error) {
    next(error);
  }
};
