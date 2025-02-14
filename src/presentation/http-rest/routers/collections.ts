import express from 'express';
import { collectionGetByIdController } from '../controllers/collection-get-controller';

export const collectionRouter = express.Router();
collectionRouter.get('/:collectionId', collectionGetByIdController);
