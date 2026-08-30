import { Notification } from '../models/Notification.js';

export const createNotification = async (userId, title, message, type, data = {}) => {
  return await Notification.create({
    user: userId,
    title,
    message,
    type,
    data
  });
};

export const getUserNotifications = async (userId) => {
  return await Notification.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(50);
};

export const markNotificationRead = async (notificationId, userId) => {
  return await Notification.findOneAndUpdate(
    { _id: notificationId, user: userId },
    { isRead: true },
    { new: true }
  );
};
