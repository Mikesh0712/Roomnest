import * as notificationService from '../services/notification.service.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const getNotifications = async (req, res, next) => {
  try {
    const list = await notificationService.getUserNotifications(req.user._id);
    return sendSuccess(res, 200, 'Notifications retrieved successfully', list);
  } catch (error) {
    next(error);
  }
};

export const markRead = async (req, res, next) => {
  try {
    const updated = await notificationService.markNotificationRead(req.params.id, req.user._id);
    return sendSuccess(res, 200, 'Notification marked as read', updated);
  } catch (error) {
    next(error);
  }
};
