import * as locationService from '../services/location.service.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const getLocations = async (req, res, next) => {
  try {
    const { search, city, type } = req.query;
    const locations = await locationService.getLocations(search, city, type);
    return sendSuccess(res, 200, 'Locations retrieved successfully', locations);
  } catch (error) {
    next(error);
  }
};

export const getPropertiesNearHub = async (req, res, next) => {
  try {
    const { locationId } = req.params;
    const { radius } = req.query;
    const result = await locationService.getPropertiesNearHub(locationId, radius);
    return sendSuccess(res, 200, 'Properties near hub retrieved successfully', result);
  } catch (error) {
    next(error);
  }
};
