import { PropertyEnquiry } from '../models/PropertyEnquiry.js';
import { Property } from '../models/Property.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const createEnquiry = async (req, res, next) => {
  try {
    const { propertyId, message } = req.body;
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property listing not found' });
    }

    const enquiry = await PropertyEnquiry.create({
      tenant: req.user._id,
      property: property._id,
      owner: property.owner,
      broker: property.broker,
      message
    });

    await Property.findByIdAndUpdate(propertyId, { $inc: { enquiryCount: 1 } });

    return sendSuccess(res, 201, 'Enquiry submitted successfully', enquiry);
  } catch (error) {
    next(error);
  }
};

export const getMyEnquiries = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === 'tenant') query.tenant = req.user._id;
    else if (req.user.role === 'owner') query.owner = req.user._id;
    else if (req.user.role === 'broker') query.broker = req.user._id;

    const enquiries = await PropertyEnquiry.find(query)
      .populate('property', 'title address locality city photos monthlyRent')
      .populate('tenant', 'name email phone')
      .sort({ createdAt: -1 });

    return sendSuccess(res, 200, 'Enquiries retrieved successfully', enquiries);
  } catch (error) {
    next(error);
  }
};
