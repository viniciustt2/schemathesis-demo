import express from 'express';
import { rootController } from '../controllers/root-controller';
import { routesRouter } from './routes-router';
import { vehiclesRouter } from './vehicles-router';
import { userMeController } from '../controllers/user-me-controller';
import { collectionPointsRouter } from './collection-points-router';
import { collectionRouter } from './collections';
import type { FileUploadProvider } from '../../../infra/providers/file-upload';

export function createRootRouter(_fileUpload: FileUploadProvider) {
	const rootRouter = express.Router();
	rootRouter.get('/', rootController);
	rootRouter.get('/me', userMeController);
	rootRouter.use('/routes', routesRouter);
	rootRouter.use('/collection-points', collectionPointsRouter);
	rootRouter.use('/collections', collectionRouter);
	rootRouter.use('/vehicles', vehiclesRouter);
	return rootRouter;
}
