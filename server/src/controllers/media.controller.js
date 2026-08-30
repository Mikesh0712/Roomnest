import * as mediaService from '../services/media.service.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const uploadMedia = async (req, res, next) => {
  try {
    const media = await mediaService.processMediaUpload(req.body, req.user);
    return sendSuccess(res, 201, 'Media processed and uploaded successfully', media);
  } catch (error) {
    next(error);
  }
};
