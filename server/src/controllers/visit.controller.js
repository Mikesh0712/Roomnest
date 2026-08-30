import * as visitService from '../services/visit.service.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const createVisit = async (req, res, next) => {
  try {
    const visit = await visitService.createVisitRequest(req.body, req.user);
    return sendSuccess(res, 201, 'Property visit requested successfully', visit);
  } catch (error) {
    next(error);
  }
};

export const getMyVisits = async (req, res, next) => {
  try {
    const visits = await visitService.getUserVisits(req.user);
    return sendSuccess(res, 200, 'Visits retrieved successfully', visits);
  } catch (error) {
    next(error);
  }
};

export const updateVisitStatus = async (req, res, next) => {
  try {
    const visit = await visitService.updateVisitStatus(req.params.id, req.body, req.user);
    return sendSuccess(res, 200, 'Visit status updated successfully', visit);
  } catch (error) {
    next(error);
  }
};
