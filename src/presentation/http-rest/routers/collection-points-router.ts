import express from 'express';
import { collectionPointGetByIdController } from '../controllers/collection-point-get-controller';
import { collectionPointCreateController } from '../controllers/collection-point-save-controller';
import { requireScopes } from '../middlewares/require-scopes';
import { collectionPointListController } from '../controllers/collection-point-list-controller';

export const collectionPointsRouter = express.Router();
collectionPointsRouter.get('/:collectionPointId', collectionPointGetByIdController);
collectionPointsRouter.get('/', collectionPointListController);
collectionPointsRouter.post('/', requireScopes(['write:collection-points']), collectionPointCreateController);
