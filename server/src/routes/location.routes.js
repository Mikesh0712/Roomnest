import express from 'express';
import * as locationController from '../controllers/location.controller.js';

const router = express.Router();

router.get('/', locationController.getLocations);
router.get('/:locationId/nearby-properties', locationController.getPropertiesNearHub);

export default router;
