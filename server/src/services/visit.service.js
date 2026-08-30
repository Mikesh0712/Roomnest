import { Visit } from '../models/Visit.js';
import { Property } from '../models/Property.js';
import { ApiError } from '../utils/apiError.js';

export const createVisitRequest = async (visitData, tenantUser) => {
  const { propertyId, requestedDate, requestedTime, notes } = visitData;

  const property = await Property.findById(propertyId);
  if (!property) {
    throw new ApiError(404, 'Property listing not found');
  }

  const visit = await Visit.create({
    tenant: tenantUser._id,
    property: property._id,
    owner: property.owner,
    broker: property.broker,
    requestedDate: new Date(requestedDate),
    requestedTime,
    notes: notes || ''
  });

  // Increment visit request counter on Property
  await Property.findByIdAndUpdate(propertyId, { $inc: { visitRequestCount: 1 } });

  return await visit.populate([
    { path: 'property', select: 'title address locality city photos monthlyRent' },
    { path: 'tenant', select: 'name email phone' }
  ]);
};

export const getUserVisits = async (user) => {
  let query = {};
  if (user.role === 'tenant') {
    query.tenant = user._id;
  } else if (user.role === 'owner') {
    query.owner = user._id;
  } else if (user.role === 'broker') {
    query.broker = user._id;
  } else if (user.role === 'admin') {
    query = {};
  }

  return await Visit.find(query)
    .populate('property', 'title address locality city photos monthlyRent')
    .populate('tenant', 'name email phone')
    .populate('owner', 'name phone')
    .sort({ createdAt: -1 });
};

export const updateVisitStatus = async (visitId, statusData, user) => {
  const visit = await Visit.findById(visitId);
  if (!visit) {
    throw new ApiError(404, 'Visit request not found');
  }

  const { status, requestedDate, requestedTime, notes, cancellationReason } = statusData;

  visit.status = status;
  if (requestedDate) visit.requestedDate = new Date(requestedDate);
  if (requestedTime) visit.requestedTime = requestedTime;
  if (notes) visit.notes = notes;
  if (cancellationReason) visit.cancellationReason = cancellationReason;

  await visit.save();
  return visit;
};
