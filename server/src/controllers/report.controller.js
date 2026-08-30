import { Report } from '../models/Report.js';
import { Property } from '../models/Property.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const createReport = async (req, res, next) => {
  try {
    const { propertyId, reason, description } = req.body;
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property listing not found' });
    }

    const report = await Report.create({
      user: req.user._id,
      property: property._id,
      reason,
      description
    });

    return sendSuccess(res, 201, 'Property report submitted to admin for investigation', report);
  } catch (error) {
    next(error);
  }
};
