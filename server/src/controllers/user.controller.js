import { User } from '../models/User.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const submitVerificationRequest = async (req, res, next) => {
  try {
    const { documents, notes } = req.body;
    const user = req.user;

    user.verificationStatus = 'pending';
    user.verificationNotes = notes || 'Verification documents submitted';
    if (documents && Array.isArray(documents)) {
      user.submittedDocuments = documents;
    }

    await user.save();
    return sendSuccess(res, 200, 'Verification request submitted successfully for admin review', user);
  } catch (error) {
    next(error);
  }
};
