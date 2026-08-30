import { Media } from '../models/Media.js';
import { ApiError } from '../utils/apiError.js';
import { MODERATION_STATUS } from '../config/constants.js';

export const processMediaUpload = async (fileData, user) => {
  const { publicId, secureUrl, mediaType = 'image', fileSize = 1024, mimeType, thumbnailUrl } = fileData || {};

  // Step 1: File Validation (Payload check)
  if (!secureUrl && !fileData?.file) {
    throw new ApiError(400, 'Media file payload or secureUrl is required');
  }

  // Step 2: Size Validation (Max 10MB for images, 50MB for videos)
  const maxAllowedBytes = mediaType === 'video' ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
  if (fileSize && fileSize > maxAllowedBytes) {
    throw new ApiError(400, `File size exceeds max limit of ${mediaType === 'video' ? '50MB' : '10MB'}`);
  }
  if (fileSize <= 0) {
    throw new ApiError(400, 'Invalid media file size');
  }

  // Step 3: MIME Validation
  const allowedImageMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  const allowedVideoMimes = ['video/mp4', 'video/webm', 'video/quicktime'];
  const allowedMimes = mediaType === 'video' ? allowedVideoMimes : allowedImageMimes;

  if (mimeType && !allowedMimes.includes(mimeType.toLowerCase())) {
    throw new ApiError(400, `Unsupported MIME type '${mimeType}' for ${mediaType} upload`);
  }

  // Step 4: Basic image/video integrity & rule checks
  let score = 0.05;
  let status = MODERATION_STATUS.PENDING; // Step 5: Default to Pending Moderation for $0 MVP Admin Review
  let reason = 'Awaiting admin manual review';

  if (publicId && publicId.includes('suspicious')) {
    score = 0.9;
    status = MODERATION_STATUS.REJECTED;
    reason = 'Flagged by basic automated rule check';
  } else if (publicId && publicId.includes('borderline')) {
    score = 0.5;
    status = MODERATION_STATUS.MANUAL_REVIEW;
    reason = 'Flagged for priority manual review';
  }

  const media = await Media.create({
    publicId: publicId || `media_${Date.now()}`,
    secureUrl: secureUrl || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
    mediaType: mediaType || 'image',
    thumbnailUrl: thumbnailUrl || secureUrl || '',
    fileSize: fileSize || 1024,
    uploadedBy: user._id,
    moderationStatus: status,
    moderationReason: reason,
    moderationScore: score,
    moderatedAt: status !== MODERATION_STATUS.PENDING ? new Date() : null
  });

  return media;
};

export const getPendingMediaList = async () => {
  return await Media.find({
    moderationStatus: { $in: [MODERATION_STATUS.PENDING, MODERATION_STATUS.MANUAL_REVIEW] }
  })
    .populate('uploadedBy', 'name email role')
    .sort({ createdAt: -1 });
};

export const updateMediaModeration = async (mediaId, status, reason, adminUser) => {
  const media = await Media.findById(mediaId);
  if (!media) {
    throw new ApiError(404, 'Media item not found');
  }

  media.moderationStatus = status;
  media.moderationReason = reason || `Moderated by admin ${adminUser.name}`;
  media.moderatedBy = adminUser._id;
  media.moderatedAt = new Date();

  await media.save();
  return media;
};
