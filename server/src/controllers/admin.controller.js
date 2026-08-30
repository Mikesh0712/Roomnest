import * as adminService from '../services/admin.service.js';
import * as mediaService from '../services/media.service.js';
import { Report } from '../models/Report.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const getUsers = async (req, res, next) => {
  try {
    const { role, verificationStatus } = req.query;
    const users = await adminService.getAllUsers(role, verificationStatus);
    return sendSuccess(res, 200, 'Users list retrieved', users);
  } catch (error) {
    next(error);
  }
};

export const blockUser = async (req, res, next) => {
  try {
    const { isBlocked } = req.body;
    const user = await adminService.toggleUserBlock(req.params.id, isBlocked !== false, req.user);
    return sendSuccess(res, 200, `User account ${user.isBlocked ? 'blocked' : 'unblocked'}`, user);
  } catch (error) {
    next(error);
  }
};

export const getPendingVerifications = async (req, res, next) => {
  try {
    const list = await adminService.getPendingVerifications();
    return sendSuccess(res, 200, 'Pending owner/broker verification requests', list);
  } catch (error) {
    next(error);
  }
};

export const approveUserVerification = async (req, res, next) => {
  try {
    const { notes } = req.body;
    const user = await adminService.processUserVerification(req.params.userId, 'verified', notes, req.user);
    return sendSuccess(res, 200, 'Owner/Broker verification approved successfully', user);
  } catch (error) {
    next(error);
  }
};

export const rejectUserVerification = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const user = await adminService.processUserVerification(req.params.userId, 'rejected', reason, req.user);
    return sendSuccess(res, 200, 'Owner/Broker verification rejected', user);
  } catch (error) {
    next(error);
  }
};

export const verifyProperty = async (req, res, next) => {
  try {
    const { notes } = req.body;
    const property = await adminService.processPropertyVerification(req.params.id, 'verified', notes, req.user);
    return sendSuccess(res, 200, 'Property marked as verified', property);
  } catch (error) {
    next(error);
  }
};

export const rejectProperty = async (req, res, next) => {
  try {
    const { notes } = req.body;
    const property = await adminService.processPropertyVerification(req.params.id, 'rejected', notes, req.user);
    return sendSuccess(res, 200, 'Property verification rejected', property);
  } catch (error) {
    next(error);
  }
};

export const getPendingMedia = async (req, res, next) => {
  try {
    const mediaList = await mediaService.getPendingMediaList();
    return sendSuccess(res, 200, 'Pending media items retrieved for review', mediaList);
  } catch (error) {
    next(error);
  }
};

export const approveMedia = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const media = await mediaService.updateMediaModeration(req.params.id, 'approved', reason, req.user);
    return sendSuccess(res, 200, 'Media approved for public display', media);
  } catch (error) {
    next(error);
  }
};

export const rejectMedia = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const media = await mediaService.updateMediaModeration(req.params.id, 'rejected', reason, req.user);
    return sendSuccess(res, 200, 'Media rejected', media);
  } catch (error) {
    next(error);
  }
};

export const manualReviewMedia = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const media = await mediaService.updateMediaModeration(req.params.id, 'manual_review', reason, req.user);
    return sendSuccess(res, 200, 'Media sent to manual review queue', media);
  } catch (error) {
    next(error);
  }
};

export const getReports = async (req, res, next) => {
  try {
    const reports = await Report.find()
      .populate('user', 'name email phone')
      .populate('property', 'title address locality city')
      .sort({ createdAt: -1 });

    return sendSuccess(res, 200, 'Property reports retrieved', reports);
  } catch (error) {
    next(error);
  }
};

export const resolveReport = async (req, res, next) => {
  try {
    const { status, resolutionNotes } = req.body;
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      {
        status: status || 'resolved',
        resolutionNotes: resolutionNotes || '',
        resolvedBy: req.user._id
      },
      { new: true }
    );

    return sendSuccess(res, 200, `Report updated to ${report.status}`, report);
  } catch (error) {
    next(error);
  }
};

export const getStats = async (req, res, next) => {
  try {
    const stats = await adminService.getAdminStats();
    return sendSuccess(res, 200, 'Platform analytics retrieved', stats);
  } catch (error) {
    next(error);
  }
};

export const getAuditLogs = async (req, res, next) => {
  try {
    const logs = await adminService.getAuditLogs();
    return sendSuccess(res, 200, 'Audit logs retrieved', logs);
  } catch (error) {
    next(error);
  }
};
