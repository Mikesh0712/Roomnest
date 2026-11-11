import { Property } from '../models/Property.js';
import { User } from '../models/User.js';
import { ApiError } from '../utils/apiError.js';
import { calculateHaversineDistance } from '../utils/distance.js';
import { escapeRegex } from '../utils/sanitize.js';

export const createProperty = async (propertyData, user) => {
  const {
    longitude,
    latitude,
    ...restData
  } = propertyData;

  const location = {
    type: 'Point',
    coordinates: [longitude, latitude]
  };

  const propertyPayload = {
    ...restData,
    location,
    lastAvailabilityConfirmedAt: new Date(),
    statusUpdatedAt: new Date()
  };

  if (user.role === 'owner') {
    propertyPayload.owner = user._id;
  } else if (user.role === 'broker') {
    propertyPayload.broker = user._id;
  } else if (user.role === 'admin') {
    propertyPayload.owner = user._id;
  }

  const property = await Property.create(propertyPayload);
  return property;
};

export const searchProperties = async (queryParams) => {
  const {
    city,
    state,
    locality,
    propertyType,
    minRent,
    maxRent,
    suitableFor,
    gender,
    sharingType,
    amenities,
    propertyStatus,
    verifiedOwner,
    verifiedBroker,
    verifiedProperty,
    latitude,
    longitude,
    maxDistance,
    sortBy = 'newest'
  } = queryParams;

  const query = {};

  // Escape regex metacharacters to eliminate ReDoS and regex injection attacks
  if (city) query.city = new RegExp(`^${escapeRegex(city)}$`, 'i');
  if (state) query.state = new RegExp(`^${escapeRegex(state)}$`, 'i');
  if (locality) query.locality = new RegExp(escapeRegex(locality), 'i');
  if (propertyType && propertyType !== 'All') query.propertyType = propertyType;
  if (propertyStatus) query.status = propertyStatus;

  // Rent filtering
  if (minRent || maxRent) {
    query.monthlyRent = {};
    if (minRent) query.monthlyRent.$gte = Number(minRent);
    if (maxRent) query.monthlyRent.$lte = Number(maxRent);
  }

  // Suitable for & Gender
  if (suitableFor) {
    const arr = Array.isArray(suitableFor) ? suitableFor : suitableFor.split(',');
    query.suitableFor = { $in: arr };
  }

  if (gender && gender !== 'All') {
    const genderTerm = gender.toLowerCase();
    query.suitableFor = { $in: [genderTerm, 'students', 'workingProfessionals', 'bachelors'] };
  }

  if (sharingType && sharingType !== 'All') {
    query.sharingType = sharingType;
  }

  // Amenities
  if (amenities) {
    const amenList = Array.isArray(amenities) ? amenities : amenities.split(',');
    query.amenities = { $all: amenList };
  }

  // Verification filters
  if (verifiedProperty === 'true') {
    query.verificationStatus = 'verified';
  }

  // Handle owner or broker verification filter joins
  let ownerUserIds = null;
  if (verifiedOwner === 'true' || verifiedBroker === 'true') {
    const roleToFind = verifiedOwner === 'true' ? 'owner' : 'broker';
    const verifiedUsers = await User.find({ role: roleToFind, verificationStatus: 'verified' }).select('_id');
    ownerUserIds = verifiedUsers.map(u => u._id);
    if (roleToFind === 'owner') {
      query.owner = { $in: ownerUserIds };
    } else {
      query.broker = { $in: ownerUserIds };
    }
  }

  // Geospatial filtering if lat & lng provided
  if (latitude && longitude && maxDistance) {
    const radMeters = Number(maxDistance) || 5000;
    query.location = {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [Number(longitude), Number(latitude)]
        },
        $maxDistance: radMeters
      }
    };
  }

  // Deterministic Sorting
  let sortOption = { createdAt: -1 };
  if (sortBy === 'lowestRent') sortOption = { monthlyRent: 1 };
  else if (sortBy === 'highestRent') sortOption = { monthlyRent: -1 };
  else if (sortBy === 'recentlyUpdated') sortOption = { statusUpdatedAt: -1 };
  else if (sortBy === 'newest') sortOption = { createdAt: -1 };

  let properties = await Property.find(query)
    .populate('owner', 'name email phone profilePhoto verificationStatus')
    .populate('broker', 'name email phone profilePhoto verificationStatus')
    .sort(sortBy === 'nearest' && !(latitude && longitude) ? { createdAt: -1 } : sortOption)
    .exec();

  // If sortBy is nearest and lat/lng provided, sort in-memory by Haversine distance
  if (sortBy === 'nearest' && latitude && longitude) {
    const latNum = Number(latitude);
    const lngNum = Number(longitude);
    properties = properties.map(p => {
      const pObj = p.toObject();
      const dist = calculateHaversineDistance(
        latNum,
        lngNum,
        p.location.coordinates[1],
        p.location.coordinates[0]
      );
      pObj.distanceMeters = dist;
      return pObj;
    }).sort((a, b) => a.distanceMeters - b.distanceMeters);
  }

  return properties;
};

export const getNearbyProperties = async (latitude, longitude, radiusMeters = 5000) => {
  const latNum = Number(latitude);
  const lngNum = Number(longitude);
  const radNum = Number(radiusMeters);

  const properties = await Property.find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [lngNum, latNum]
        },
        $maxDistance: radNum
      }
    }
  })
    .populate('owner', 'name verificationStatus')
    .populate('broker', 'name verificationStatus')
    .exec();

  return properties.map(p => {
    const pObj = p.toObject();
    const distanceMeters = calculateHaversineDistance(
      latNum,
      lngNum,
      p.location.coordinates[1],
      p.location.coordinates[0]
    );
    return {
      property: pObj,
      distanceMeters,
      distanceKm: (distanceMeters / 1000).toFixed(2),
      rent: p.monthlyRent,
      status: p.status,
      verificationStatus: p.verificationStatus
    };
  });
};

export const getPropertyById = async (id) => {
  const property = await Property.findByIdAndUpdate(
    id,
    { $inc: { viewsCount: 1 } },
    { new: true }
  )
    .populate('owner', 'name email phone profilePhoto verificationStatus')
    .populate('broker', 'name email phone profilePhoto verificationStatus')
    .populate('mediaItems');

  if (!property) {
    throw new ApiError(404, 'Property listing not found');
  }

  return property;
};

export const updatePropertyStatus = async (id, statusData, user) => {
  const property = await Property.findById(id);
  if (!property) {
    throw new ApiError(404, 'Property listing not found');
  }

  // Authorization check
  const isOwner = property.owner && property.owner.toString() === user._id.toString();
  const isBroker = property.broker && property.broker.toString() === user._id.toString();
  const isAdmin = user.role === 'admin';

  if (!isOwner && !isBroker && !isAdmin) {
    throw new ApiError(403, 'You do not have permission to update this property status');
  }

  const { status, statusReason, availableFrom } = statusData;

  property.status = status;
  if (statusReason !== undefined) property.statusReason = statusReason;
  if (availableFrom !== undefined) property.availableFrom = new Date(availableFrom);
  property.lastAvailabilityConfirmedAt = new Date();
  property.statusUpdatedAt = new Date();

  await property.save();
  return property;
};

export const confirmAvailability = async (id, user) => {
  const property = await Property.findById(id);
  if (!property) {
    throw new ApiError(404, 'Property listing not found');
  }

  // Broken Access Control / IDOR Defense: Only listing owner, assigned broker, or admin can confirm
  const isOwner = property.owner && property.owner.toString() === user._id.toString();
  const isBroker = property.broker && property.broker.toString() === user._id.toString();
  const isAdmin = user.role === 'admin';

  if (!isOwner && !isBroker && !isAdmin) {
    throw new ApiError(403, 'Access denied: You do not have permission to confirm availability for this property');
  }

  property.lastAvailabilityConfirmedAt = new Date();
  await property.save();
  return property;
};

export const compareProperties = async (propertyIdsArray) => {
  const properties = await Property.find({ _id: { $in: propertyIdsArray } })
    .populate('owner', 'name verificationStatus')
    .populate('broker', 'name verificationStatus');

  return properties;
};
