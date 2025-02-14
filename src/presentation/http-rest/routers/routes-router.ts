import express from 'express';
import { routeListController } from '../controllers/route-list-controller';
import { routeStartController } from '../controllers/route-start-controller';
import { routeFinishtController } from '../controllers/route-finish-controller';
import { routeGetByIdController } from '../controllers/route-get-controller';
import { collectionStartController } from '../controllers/collection-start-controller';
import { collectionFinishController } from '../controllers/collection-finish-controller';
import { collectionPointListByRouteController } from '../controllers/collection-point-list-by-route-controller';

export const routesRouter = express.Router();
routesRouter.get('/', routeListController);
routesRouter.post('/:routeId/start', routeStartController);
routesRouter.post('/:routeId/finish', routeFinishtController);
routesRouter.get('/:routeId', routeGetByIdController);
routesRouter.get('/:routeId/collection-points', collectionPointListByRouteController);
routesRouter.post('/:routeId/collections/:collectionId/start', collectionStartController);
routesRouter.post('/:routeId/collections/:collectionId/finish', collectionFinishController);
