import { User } from '../models/User.js';
import { Property } from '../models/Property.js';
import { Visit } from '../models/Visit.js';
import { Report } from '../models/Report.js';
import { AuditLog } from '../models/AuditLog.js';
import { ApiError } from '../utils/apiError.js';

export const logAudit = async (actorId, action, entityType, entityId, oldValue = null, newValue = null, ipAddress = '') => {
  await AuditLog.create({
    actor: actorId,
    action,
    entityType,
    entityId: entityId.toString(),
    oldValue,
    newValue,
    ipAddress
  });
};

export const getAllUsers = async (role, verificationStatus) => {
  const query = {};
  if (role) query.role = role;
  if (verificationStatus) query.verificationStatus = verificationStatus;
  return await User.find(query).sort({ createdAt: -1 });
};

export const toggleUserBlock = async (userId, isBlocked, adminUser) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'User not found');

  const oldVal = user.isBlocked;
  user.isBlocked = isBlocked;
  await user.save();

  await logAudit(adminUser._id, isBlocked ? 'USER_BLOCKED' : 'USER_UNBLOCKED', 'User', user._id, { isBlocked: oldVal }, { isBlocked });
  return user;
};

export const getPendingVerifications = async () => {
  return await User.find({
    role: { $in: ['owner', 'broker'] },
    verificationStatus: 'pending'
  }).sort({ createdAt: -1 });
};

export const processUserVerification = async (userId, status, notes, adminUser) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'User not found');

  const oldStatus = user.verificationStatus;
  user.verificationStatus = status;
  user.verificationNotes = notes || '';
  if (status === 'verified') {
    user.verifiedAt = new Date();
    user.verifiedBy = adminUser._id;
  } else if (status === 'rejected') {
    user.rejectionReason = notes || 'Documentation invalid';
  }

  await user.save();
  await logAudit(adminUser._id, `USER_VERIFICATION_${status.toUpperCase()}`, 'User', user._id, { verificationStatus: oldStatus }, { verificationStatus: status });
  return user;
};

export const processPropertyVerification = async (propertyId, status, notes, adminUser) => {
  const property = await Property.findById(propertyId);
  if (!property) throw new ApiError(404, 'Property not found');

  const oldStatus = property.verificationStatus;
  property.verificationStatus = status;
  property.verificationNotes = notes || '';
  if (status === 'verified') {
    property.verifiedAt = new Date();
    property.verifiedBy = adminUser._id;
  }

  await property.save();
  await logAudit(adminUser._id, `PROPERTY_VERIFICATION_${status.toUpperCase()}`, 'Property', property._id, { verificationStatus: oldStatus }, { verificationStatus: status });
  return property;
};

export const getAdminStats = async () => {
  const [
    totalUsers,
    verifiedOwners,
    verifiedBrokers,
    totalProperties,
    availableProperties,
    totalVisits,
    pendingReports
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: 'owner', verificationStatus: 'verified' }),
    User.countDocuments({ role: 'broker', verificationStatus: 'verified' }),
    Property.countDocuments(),
    Property.countDocuments({ status: 'available' }),
    Visit.countDocuments(),
    Report.countDocuments({ status: 'pending' })
  ]);

  return {
    totalUsers,
    verifiedOwners,
    verifiedBrokers,
    totalProperties,
    availableProperties,
    totalVisits,
    pendingReports,
    activeCity: 'Bhubaneswar (Phase 1) & Bangalore (Phase 2)',
    topHub: 'KIIT University Campus'
  };
};

export const getAuditLogs = async () => {
  return await AuditLog.find()
    .populate('actor', 'name email role')
    .sort({ createdAt: -1 })
    .limit(100);
};
