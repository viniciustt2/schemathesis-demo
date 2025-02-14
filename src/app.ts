import express from 'express';
import cors from 'cors';
import env from 'env-var';
import helmet from 'helmet';
import winston from 'winston';
import session from 'express-session';
import swaggerUi from 'swagger-ui-express';
import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { createRootRouter } from './presentation/http-rest/routers/root-router';
import { notFoundController } from './presentation/http-rest/handlers/not-found';
import { requestTimeMiddleware } from './presentation/http-rest/middlewares/request-time';
import { serveRawSwaggerDocument } from './presentation/http-rest/handlers/swagger-raw-file';
import { registry } from './presentation/http-rest/openapi/registry';
import { errorHandler } from './presentation/http-rest/handlers/error';
import { withContext } from './presentation/http-rest/middlewares/with-context';
import { withRepositories } from './presentation/http-rest/middlewares/with-repositories';
import { PrismaClient } from '@prisma/client';
import { withAuthentication } from './presentation/http-rest/middlewares/oidc-authentication';
import { KeycloakHttp } from './infra/providers/keycloak';
import { OpenAPIFileStorageAdapter } from './infra/providers/open-api-file/open-api-file-storage-adaptar';
import { LocalFileStorage } from './infra/providers/file-storage';
import { KeyCloakFake } from './infra/providers/keycloak/keycloak-fake';
import { MulterFileUploadProvider } from './infra/providers/file-upload';

const API_NAME = env.get('API_NAME').required().asString();
const API_VERSION = env.get('API_VERSION').required().asString();
const API_BASE_URL = env.get('API_BASE_URL').required().asUrlString();
const DOMAIN_ADDRESS = env.get('DOMAIN_ADDRESS').required().asString();
const API_PATH = env.get('API_PATH').required().asString();
const TCP_PORT = env.get('TCP_PORT').required().asPortNumber();
const PUBLIC_FOLDER = env.get('PUBLIC_FOLDER').default('./public').asString();
const WILL_DISABLE_AUTHENTICATION = env.get('WILL_DISABLE_AUTHENTICATION').default('false').asBool();

// CONTENT SECURITY POLICY
const CONTENT_SECURITY_SCRIPT_SRC = env.get('CONTENT_SECURITY_SCRIPT_SRC').required().asArray();

// LOGGING CONFIGURATION
const LOG_LEVEL = env.get('LOG_LEVEL').required().asEnum(['error', 'warn', 'info', 'http', 'verbose', 'debug']);

// SESSION CONFIGURATION PARAMETERS
const SESSION_NAME = env.get('SESSION_NAME').required().asString();
const SESSION_SECRET = env.get('SESSION_SECRET').required().asString();
const SESSION_MAX_AGE_MS = env.get('SESSION_MAX_AGE_MS').required().asInt();

// CORS CONFIGURATION PARAMETERS
const CORS_METHODS = env.get('CORS_METHODS').required().asArray(',');
//const CORS_ORIGINS = env.get('CORS_ORIGINS').required().asArray(',');
const CORS_MAX_AGE = env.get('CORS_MAX_AGE').required().asIntPositive();

// OPENAPI SWAGGER CONFIGURATION
const SWAGGER_PATH = env.get('SWAGGER_PATH').required().asString();
const SWAGGER_RAW_PATH = env.get('SWAGGER_RAW_PATH').required().asString();
const SWAGGER_TITLE = env.get('SWAGGER_TITLE').required().asString();
const SWAGGER_VERSION = env.get('SWAGGER_VERSION').required().asEnum(['3.0.0', '3.0.1', '3.0.2', '3.0.3', '3.1.0']);
const SWAGGER_DESCRIPTION = env.get('SWAGGER_DESCRIPTION').required().asString();

// OIDC CONFIGURATION
const OIDC_JWKS_URL = env.get('OIDC_JWKS_URL').required().asUrlObject();
const OIDC_ISSUER = env.get('OIDC_ISSUER').required().asString();
const OIDC_AUDIENCE = env.get('OIDC_AUDIENCE').required().asString();

// KEYCLOAK CONFIGURATION
const KEYCLOAK_CLIENT_ID = env.get('KEYCLOAK_CLIENT_ID').required().asString();
const KEYCLOAK_CLIENT_SECRET = env.get('KEYCLOAK_CLIENT_SECRET').required().asString();
const KEYCLOAK_GRANT_TYPE = env.get('KEYCLOAK_GRANT_TYPE').required().asString();
const KEYCLOAK_ADMIN_USERNAME = env.get('KEYCLOAK_ADMIN_USERNAME').required().asString();
const KEYCLOAK_ADMIN_PASSWORD = env.get('KEYCLOAK_ADMIN_PASSWORD').required().asString();
const KEYCLOAK_DOMAIN = env.get('KEYCLOAK_DOMAIN').required().asString();

const API_URL = new URL(API_PATH, API_BASE_URL);
API_URL.port = TCP_PORT.toString();

const corsPolicy = cors({
	// origin: CORS_ORIGINS,
	methods: CORS_METHODS,
	maxAge: CORS_MAX_AGE,
	credentials: true,
});

// @see https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
const headersPolicy = helmet({
	crossOriginEmbedderPolicy: { policy: 'require-corp' }, // @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Embedder-Policy
	contentSecurityPolicy: { directives: { scriptSrc: CONTENT_SECURITY_SCRIPT_SRC } },
	xPoweredBy: false,
});

// @see https://expressjs.com/en/advanced/best-practice-security.html
const appSession = session({
	name: SESSION_NAME,
	secret: SESSION_SECRET,
	saveUninitialized: true,
	resave: false,
	cookie: {
		httpOnly: true,
		secure: true,
		domain: DOMAIN_ADDRESS,
		path: API_PATH,
		maxAge: SESSION_MAX_AGE_MS,
	},
});

const logger = winston.createLogger({
	level: LOG_LEVEL,
	format: winston.format.json(),
	defaultMeta: { service: API_NAME, version: API_VERSION },
	transports: [
		new winston.transports.Console({
			format: winston.format.simple(),
		}),
	],
});

const swaggerGenerator = new OpenApiGeneratorV3(registry.definitions);
const swaggerDocument = swaggerGenerator.generateDocument({
	servers: [{ url: API_URL.toString() }],
	openapi: SWAGGER_VERSION,
	info: {
		title: SWAGGER_TITLE,
		version: API_VERSION,
		description: SWAGGER_DESCRIPTION,
	},
});

const openAPIStorage = new OpenAPIFileStorageAdapter('openapi.json', new LocalFileStorage());
await openAPIStorage.save(swaggerDocument);

export const prisma = new PrismaClient();

const keycloak = WILL_DISABLE_AUTHENTICATION
	? new KeyCloakFake()
	: await KeycloakHttp.createAuthenticated({
			client_id: KEYCLOAK_CLIENT_ID,
			client_secret: KEYCLOAK_CLIENT_SECRET,
			grant_type: KEYCLOAK_GRANT_TYPE,
			username: KEYCLOAK_ADMIN_USERNAME,
			password: KEYCLOAK_ADMIN_PASSWORD,
			domain: KEYCLOAK_DOMAIN,
		});

const fileUploadProvider = new MulterFileUploadProvider();

const app = express();

app.set('trust proxy', 1);
app.disable('x-powered-by'); // @see https://helmetjs.github.io/#x-powered-by
app.use(appSession);
app.use(corsPolicy); // @see https://github.com/expressjs/cors
app.use(headersPolicy); // @see https://helmetjs.github.io
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(PUBLIC_FOLDER));

app.use(SWAGGER_RAW_PATH, serveRawSwaggerDocument(swaggerDocument));
app.use(SWAGGER_PATH, swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(withContext({ logger, fileUploadProvider }));

app.use(
	withAuthentication(
		{ jwksURL: OIDC_JWKS_URL, issuer: OIDC_ISSUER, audience: OIDC_AUDIENCE },
		WILL_DISABLE_AUTHENTICATION,
	),
);
app.use(withRepositories({ prisma, keycloak }));
app.use(requestTimeMiddleware);
app.use(API_PATH, createRootRouter(fileUploadProvider));
app.use(errorHandler);
app.use(notFoundController);

export default app;
