import mongoose from 'mongoose';
import { PROPERTY_TYPES, SHARING_TYPES, SUITABLE_FOR, AMENITIES, PROPERTY_STATUS, USER_VERIFICATION_STATUS } from '../config/constants.js';

const customRuleSchema = new mongoose.Schema({
  rule: { type: String, required: true }
}, { _id: false });

const houseRulesSchema = new mongoose.Schema({
  smokingAllowed: { type: Boolean, default: false },
  drinkingAllowed: { type: Boolean, default: false },
  partiesAllowed: { type: Boolean, default: false },
  petsAllowed: { type: Boolean, default: false },
  visitorsAllowed: { type: Boolean, default: true },
  oppositeGenderVisitorsAllowed: { type: Boolean, default: false },
  curfewEnabled: { type: Boolean, default: false },
  curfewTime: { type: String, default: '' },
  quietHoursEnabled: { type: Boolean, default: false },
  quietHoursStart: { type: String, default: '' },
  quietHoursEnd: { type: String, default: '' },
  studentOnly: { type: Boolean, default: false },
  workingProfessionalOnly: { type: Boolean, default: false },
  idProofRequired: { type: Boolean, default: true },
  policeVerificationRequired: { type: Boolean, default: true },
  customRules: [customRuleSchema]
}, { _id: false });

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Property title is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  propertyType: {
    type: String,
    enum: PROPERTY_TYPES,
    required: [true, 'Property type is required']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  broker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true,
    index: true
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true
  },
  locality: {
    type: String,
    required: [true, 'Locality is required'],
    trim: true,
    index: true
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  landmark: {
    type: String,
    default: ''
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },

  // Rental Information
  monthlyRent: { type: Number, required: true, index: true },
  securityDeposit: { type: Number, default: 0 },
  maintenance: { type: Number, default: 0 },
  electricityIncluded: { type: Boolean, default: false },
  waterIncluded: { type: Boolean, default: true },
  foodIncluded: { type: Boolean, default: false },
  brokerage: { type: Number, default: 0 },
  availableFrom: { type: Date, default: Date.now },

  // Occupancy Information
  totalRooms: { type: Number, default: 1 },
  availableRooms: { type: Number, default: 1 },
  currentOccupants: { type: Number, default: 0 },
  maxOccupants: { type: Number, default: 1 },
  sharingType: { type: String, enum: SHARING_TYPES, default: 'single' },

  // Structured Arrays
  suitableFor: [{ type: String, enum: SUITABLE_FOR }],
  amenities: [{ type: String, enum: AMENITIES }],
  moveInChecklist: [{ type: String }],

  // House Rules
  houseRules: { type: houseRulesSchema, default: () => ({}) },

  // Availability & Trust Status
  status: {
    type: String,
    enum: Object.values(PROPERTY_STATUS),
    default: PROPERTY_STATUS.AVAILABLE,
    index: true
  },
  statusReason: { type: String, default: '' },
  lastAvailabilityConfirmedAt: { type: Date, default: Date.now },
  statusUpdatedAt: { type: Date, default: Date.now },

  // Property Verification
  verificationStatus: {
    type: String,
    enum: Object.values(USER_VERIFICATION_STATUS),
    default: USER_VERIFICATION_STATUS.UNVERIFIED,
    index: true
  },
  verifiedAt: { type: Date },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  verificationNotes: { type: String, default: '' },

  // Media references
  photos: [{ type: String }], // Array of Cloudinary/media URLs
  thumbnail: { type: String, default: '' },
  videoWalkthroughUrl: { type: String, default: '' },
  virtualTourUrl: { type: String, default: '' },
  mediaItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Media' }],

  // Real Demand Indicators
  viewsCount: { type: Number, default: 0 },
  enquiryCount: { type: Number, default: 0 },
  wishlistCount: { type: Number, default: 0 },
  visitRequestCount: { type: Number, default: 0 }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// GeoJSON 2dsphere Index
propertySchema.index({ location: '2dsphere' });
propertySchema.index({ city: 1, locality: 1, propertyType: 1, monthlyRent: 1 });
propertySchema.index({ status: 1, verificationStatus: 1 });

// Virtual to determine if availability needs confirmation (older than 30 days)
propertySchema.virtual('availabilityNeedsConfirmation').get(function () {
  if (!this.lastAvailabilityConfirmedAt) return true;
  const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
  return (Date.now() - new Date(this.lastAvailabilityConfirmedAt).getTime()) > thirtyDaysMs;
});

export const Property = mongoose.model('Property', propertySchema);
