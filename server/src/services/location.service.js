import { Location } from '../models/Location.js';
import { Property } from '../models/Property.js';
import { ApiError } from '../utils/apiError.js';
import { calculateHaversineDistance } from '../utils/distance.js';

export const getLocations = async (search, city, type) => {
  const query = {};
  if (city) query.city = new RegExp(`^${city}$`, 'i');
  if (type) query.type = type;
  if (search) {
    query.name = new RegExp(search, 'i');
  }

  return await Location.find(query).sort({ name: 1 });
};

export const getPropertiesNearHub = async (locationId, radiusMeters = 5000) => {
  const hub = await Location.findById(locationId);
  if (!hub) {
    throw new ApiError(404, 'Educational or Office Hub location not found');
  }

  const [lng, lat] = hub.location.coordinates;
  const properties = await Property.find({
    location: {
      $near: {
        $geometry: { type: 'Point', coordinates: [lng, lat] },
        $maxDistance: Number(radiusMeters)
      }
    }
  })
    .populate('owner', 'name verificationStatus')
    .populate('broker', 'name verificationStatus');

  return {
    hub: {
      id: hub._id,
      name: hub.name,
      type: hub.type,
      city: hub.city,
      coordinates: hub.location.coordinates
    },
    totalProperties: properties.length,
    properties: properties.map(p => {
      const pObj = p.toObject();
      const distanceMeters = calculateHaversineDistance(
        lat,
        lng,
        p.location.coordinates[1],
        p.location.coordinates[0]
      );
      return {
        ...pObj,
        distanceMeters,
        distanceKm: (distanceMeters / 1000).toFixed(2)
      };
    })
  };
};
