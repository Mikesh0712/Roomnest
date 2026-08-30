import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: [
      'newEnquiry',
      'visitRequest',
      'visitConfirmed',
      'visitRejected',
      'visitRescheduled',
      'propertyStatusChanged',
      'verificationApproved',
      'verificationRejected',
      'mediaApproved',
      'mediaRejected',
      'reportUpdate'
    ]
  },
  isRead: {
    type: Boolean,
    default: false
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, { timestamps: true });

export const Notification = mongoose.model('Notification', notificationSchema);
