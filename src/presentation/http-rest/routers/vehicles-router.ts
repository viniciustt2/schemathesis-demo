import express from 'express';
import { vehicleListController } from '../controllers/vehicle-list-controller';

export const vehiclesRouter = express.Router();
vehiclesRouter.get('/', vehicleListController);
