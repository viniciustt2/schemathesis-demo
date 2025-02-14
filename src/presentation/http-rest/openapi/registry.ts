import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { rootRouteConfig } from '../controllers/root-controller';
import { routeListRouteConfig } from '../controllers/route-list-controller';
import { vehicleListRouteConfig } from '../controllers/vehicle-list-controller';
import { userMeRouteConfig } from '../controllers/user-me-controller';
import { collectionPointListByRouteRouteConfig } from '../controllers/collection-point-list-by-route-controller';
import { routeStartRouteConfig } from '../controllers/route-start-controller';
import { routeFinishRouteConfig } from '../controllers/route-finish-controller';
import { routeGetByIdRouteConfig } from '../controllers/route-get-controller';
import { collectionPointGetByIdRouteConfig } from '../controllers/collection-point-get-controller';
import { collectionStartRouteConfig } from '../controllers/collection-start-controller';
import { collectionFinishRouteConfig } from '../controllers/collection-finish-controller';
import { collectionPointSaveRouteConfig } from '../controllers/collection-point-save-controller';
import { collectionPointListRouteConfig } from '../controllers/collection-point-list-controller';
import { collectionGetByIdRouteConfig } from '../controllers/collection-get-controller';

export const registry = new OpenAPIRegistry();
// >      Root
registry.registerPath(rootRouteConfig);
// >      Routes
registry.registerPath(routeGetByIdRouteConfig);
registry.registerPath(routeListRouteConfig);
registry.registerPath(routeStartRouteConfig);
registry.registerPath(routeFinishRouteConfig);
// >      CollectionPoints
registry.registerPath(collectionPointListByRouteRouteConfig);
registry.registerPath(collectionPointListRouteConfig);
registry.registerPath(collectionPointGetByIdRouteConfig);
registry.registerPath(collectionPointSaveRouteConfig);
// >      Collections
registry.registerPath(collectionStartRouteConfig);
registry.registerPath(collectionFinishRouteConfig);
registry.registerPath(collectionGetByIdRouteConfig);
// >      Vehicles
registry.registerPath(vehicleListRouteConfig);
// >      Users
registry.registerPath(userMeRouteConfig);
