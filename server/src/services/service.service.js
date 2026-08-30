import { NearbyService } from '../models/NearbyService.js';
import { calculateHaversineDistance } from '../utils/distance.js';

export const searchNearbyServices = async (latitude, longitude, radiusMeters = 3000, category, city) => {
  const query = {};

  if (category && category !== 'All') query.category = category;
  if (city) query.city = new RegExp(`^${city}$`, 'i');

  if (latitude && longitude) {
    const latNum = Number(latitude);
    const lngNum = Number(longitude);
    const radNum = Number(radiusMeters);

    query.location = {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [lngNum, latNum]
        },
        $maxDistance: radNum
      }
    };
  }

  const services = await NearbyService.find(query).exec();

  if (latitude && longitude) {
    const latNum = Number(latitude);
    const lngNum = Number(longitude);

    return services.map(s => {
      const sObj = s.toObject();
      const distanceMeters = calculateHaversineDistance(
        latNum,
        lngNum,
        s.location.coordinates[1],
        s.location.coordinates[0]
      );
      return {
        ...sObj,
        distanceMeters,
        distanceText: distanceMeters < 1000 ? `${distanceMeters}m` : `${(distanceMeters / 1000).toFixed(1)}km`
      };
    });
  }

  return services;
};

export const createService = async (serviceData, user) => {
  const { longitude, latitude, ...rest } = serviceData;
  const location = {
    type: 'Point',
    coordinates: [longitude, latitude]
  };

  const service = await NearbyService.create({
    ...rest,
    location,
    provider: user ? user._id : undefined
  });

  return service;
};
