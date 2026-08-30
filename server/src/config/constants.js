export const ROLES = {
  TENANT: 'tenant',
  OWNER: 'owner',
  BROKER: 'broker',
  ADMIN: 'admin'
};

export const USER_VERIFICATION_STATUS = {
  UNVERIFIED: 'unverified',
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected'
};

export const PROPERTY_TYPES = [
  'PG',
  'room',
  '1BHK',
  '2BHK',
  '3BHK',
  'apartment',
  'independentHouse',
  'hostel'
];

export const SHARING_TYPES = [
  'single',
  'double',
  'triple',
  'fourSharing',
  'private'
];

export const SUITABLE_FOR = [
  'students',
  'workingProfessionals',
  'bachelors',
  'couples',
  'families',
  'boys',
  'girls'
];

export const AMENITIES = [
  'wifi',
  'ac',
  'fan',
  'bed',
  'mattress',
  'wardrobe',
  'studyTable',
  'chair',
  'geyser',
  'refrigerator',
  'washingMachine',
  'kitchen',
  'parking',
  'balcony',
  'lift',
  'powerBackup',
  'waterPurifier',
  'furnished',
  'semiFurnished'
];

export const PROPERTY_STATUS = {
  AVAILABLE: 'available',
  RESERVED: 'reserved',
  OCCUPIED: 'occupied',
  UNDER_RENOVATION: 'under_renovation',
  TEMPORARILY_UNAVAILABLE: 'temporarily_unavailable',
  PERMANENTLY_UNAVAILABLE: 'permanently_unavailable'
};

export const MODERATION_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  MANUAL_REVIEW: 'manual_review'
};

export const LOCATION_TYPES = [
  'college',
  'university',
  'office',
  'ITPark',
  'landmark'
];

export const SERVICE_CATEGORIES = [
  'meal',
  'tiffin',
  'mess',
  'laundry',
  'cleaning',
  'wifi',
  'grocery',
  'pharmacy',
  'hospital',
  'salon',
  'atm',
  'transport',
  'packersMovers',
  'furnitureRental',
  'electrician',
  'plumber',
  'waterSupplier',
  'gasDelivery',
  'stationery'
];

export const ENQUIRY_STATUS = [
  'new',
  'contacted',
  'scheduled',
  'converted',
  'closed'
];

export const VISIT_STATUS = [
  'requested',
  'confirmed',
  'rescheduled',
  'completed',
  'cancelled',
  'rejected'
];

export const REPORT_STATUS = [
  'pending',
  'investigating',
  'resolved',
  'rejected'
];

export const REPORT_REASONS = [
  'fake_listing',
  'wrong_photos',
  'wrong_price',
  'unavailable_property',
  'scam',
  'misleading_information',
  'inappropriate_content',
  'duplicate_listing'
];
