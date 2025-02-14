import { PrismaClient } from '@prisma/client';
import { CollectionPointStatus } from '../src/domain/value-objects/collection-point-status';
import winston from 'winston';
import env from 'env-var';
import { CollectionStatus } from '../src/domain/value-objects/collection-status';

// LOGGING CONFIGURATION
const LOG_LEVEL = env.get('LOG_LEVEL').required().asEnum(['error', 'warn', 'info', 'http', 'verbose', 'debug']);
const API_NAME = env.get('API_NAME').required().asString();
const API_VERSION = env.get('API_VERSION').required().asString();
const DATABASE_URL = env.get('DATABASE_URL').required().asString();

const prisma = new PrismaClient();
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

async function main() {
	logger.info('executing database seeding...');

	logger.info('adding vehicle to database', { id: 'ed3f0cc6-8836-4483-a2a3-b510f5fc6e8e' });
	await prisma.vehicles.upsert({
		where: { id: 'ed3f0cc6-8836-4483-a2a3-b510f5fc6e8e' },
		create: { id: 'ed3f0cc6-8836-4483-a2a3-b510f5fc6e8e', name: 'TRIVIM 1' },
		update: {},
	});

	logger.info('adding user to database', { id: '1f1309e9-498b-4892-9f8f-5c87d0dd83b9' });
	await prisma.users.upsert({
		where: { id: '1f1309e9-498b-4892-9f8f-5c87d0dd83b9' },
		create: { id: '1f1309e9-498b-4892-9f8f-5c87d0dd83b9', fullName: 'Motorista', initials: 'MO' },
		update: {},
	});

	const operator = await prisma.operator.upsert({
		where: { id: '738515b5-6cc1-4db7-b6fd-b24a8929a0d8' },
		create: {
			id: '738515b5-6cc1-4db7-b6fd-b24a8929a0d8',
			status: 'ACTIVE',
			cep: '53401200',
			cnpj: '05662582000195',
			contact: 'andre',
			email: 'andre@example.com.br',
			name: 'operador 1',
			phone: '5555555555',
		},
		update: {},
	});

	logger.info('adding route to database', { id: 'f7f16595-8537-486b-9027-ee419435980c' });
	const route = await prisma.routes.upsert({
		where: {
			id: 'f7f16595-8537-486b-9027-ee419435980c',
		},
		create: {
			id: 'f7f16595-8537-486b-9027-ee419435980c',
			name: 'Rota 1',
			status: 'PENDING',
			totalDistanceKm: 40,
			totalTimeMs: 14400000,
			date: '2024-12-16T12:00:00.000Z',
			collections: {
				create: [
					{
						id: '0f551194-1691-4e52-9094-d9e13a67cbf8',
						status: CollectionStatus.enum.PENDING,
						date: '2024-12-16T12:00:00.000Z',
						volumeCollected: 0,
						collectionPoint: {
							create: {
								id: '361754a6-845b-419b-8f96-be1f01fa899e',
								type: 'APARTMENT',
								name: 'Edifício Residencial Lausanne',
								status: CollectionPointStatus.enum.ACTIVE,
								address: JSON.stringify({
									state: 'SP',
									city: 'Sao Paulo',
									zipcode: '04026-000',
									number: '123',
									district: 'Vila Mariana',
									street: 'Rua Lorem Ipsum',
									complement: 'Entrada Sul',
									coordinate: { latitude: -8.038912, longitude: -34.870932 },
								}),
								bestCollectionDay: JSON.stringify(['FRIDAY']),
								selectiveCollectionDay: JSON.stringify(['FRIDAY']),
								contact: JSON.stringify({
									name: 'Matias Castro',
									position: 'Responsável pela coleta',
									phone: '1234567890',
									email: 'H9k5y@example.com',
								}),
								weeklyGlassVolume: 1000,
								operatorId: operator.id,
							},
						},
					},

					{
						id: 'a323eadb-1ffc-4227-b4c4-0b9ee48d38a2',
						status: CollectionStatus.enum.PENDING,
						date: '2024-12-16T12:00:00.000Z',
						volumeCollected: 0,
						collectionPoint: {
							create: {
								id: '97f2ab4c-ef96-42a5-9da8-395f236c875e',
								name: 'Edifício Itamarati',
								type: 'APARTMENT',
								status: CollectionPointStatus.enum.ACTIVE,
								address: JSON.stringify({
									state: 'SP',
									city: 'Sao Paulo',
									zipcode: '04026-000',
									number: '123',
									district: 'Vila Mariana',
									street: 'Rua Dolor Sit',
									complement: 'Entrada Norte',
									coordinate: { latitude: -8.059377, longitude: -34.886952 },
								}),
								bestCollectionDay: JSON.stringify(['FRIDAY']),
								selectiveCollectionDay: JSON.stringify(['FRIDAY']),
								contact: JSON.stringify({
									name: 'Matias Castro',
									position: 'Responsável pela coleta',
									phone: '1234567890',
									email: 'H9k5y@example.com',
								}),
								weeklyGlassVolume: 1000,
								operatorId: operator.id,
							},
						},
					},
				],
			},
		},
		update: {},
	});

	await prisma.routesCollectionPoints.upsert({
		where: {
			routeId_collectionPointId: {
				routeId: route.id,
				collectionPointId: '361754a6-845b-419b-8f96-be1f01fa899e',
			},
		},
		create: {
			routeId: route.id,
			collectionPointId: '361754a6-845b-419b-8f96-be1f01fa899e',
		},
		update: {},
	});

	await prisma.routesCollectionPoints.upsert({
		where: {
			routeId_collectionPointId: {
				routeId: route.id,
				collectionPointId: '97f2ab4c-ef96-42a5-9da8-395f236c875e',
			},
		},
		create: {
			routeId: route.id,
			collectionPointId: '97f2ab4c-ef96-42a5-9da8-395f236c875e',
		},
		update: {},
	});

	const route2 = await prisma.routes.upsert({
		where: {
			id: 'aa34ef2d-728b-47b2-9097-3fecf4427777',
		},
		create: {
			id: 'aa34ef2d-728b-47b2-9097-3fecf4427777',
			name: 'Rota 2',
			status: 'PENDING',
			totalDistanceKm: 40,
			totalTimeMs: 14400000,
			date: '2024-12-16T12:00:00.000Z',
			collections: {
				create: [
					{
						status: CollectionStatus.enum.PENDING,
						date: '2024-12-16T12:00:00.000Z',
						volumeCollected: 0,
						collectionPoint: {
							create: {
								id: 'c942468c-7432-47e9-8c80-2d0d8dab742c',
								name: 'Edifício Residencial Rio do Fogo',
								type: 'APARTMENT',
								status: CollectionPointStatus.enum.ACTIVE,
								address: JSON.stringify({
									state: 'SP',
									city: 'Sao Paulo',
									zipcode: '04026-000',
									number: '123',
									district: 'Vila Mariana',
									street: 'Rua Lorem Ipsum',
									complement: 'Entrada Sul',
									coordinate: { latitude: -8.048626, longitude: -34.882787 },
								}),
								bestCollectionDay: JSON.stringify(['FRIDAY']),
								selectiveCollectionDay: JSON.stringify(['FRIDAY']),
								contact: JSON.stringify({
									name: 'Matias Castro',
									position: 'Responsável pela coleta',
									phone: '1234567890',
									email: 'H9k5y@example.com',
								}),
								weeklyGlassVolume: 1000,
								operatorId: operator.id,
							},
						},
					},
					{
						status: CollectionStatus.enum.PENDING,
						date: '2024-12-16T12:00:00.000Z',
						volumeCollected: 0,
						collectionPoint: {
							create: {
								id: '71bb73d3-6a0c-4a08-b168-a872cf33ee45',
								name: 'Edifício Residencial Ponta de Pedras',
								type: 'APARTMENT',
								status: CollectionPointStatus.enum.ACTIVE,
								address: JSON.stringify({
									state: 'SP',
									city: 'Sao Paulo',
									zipcode: '04026-000',
									number: '123',
									district: 'Vila Mariana',
									street: 'Rua Lorem Ipsum',
									complement: 'Entrada Sul',
									coordinate: { latitude: -8.047054, longitude: -34.878486 },
								}),
								bestCollectionDay: JSON.stringify(['FRIDAY']),
								selectiveCollectionDay: JSON.stringify(['FRIDAY']),
								contact: JSON.stringify({
									name: 'Matias Castro',
									position: 'Responsável pela coleta',
									phone: '1234567890',
									email: 'H9k5y@example.com',
								}),
								weeklyGlassVolume: 1000,
								operatorId: operator.id,
							},
						},
					},
				],
			},
		},
		update: {},
	});

	await prisma.routesCollectionPoints.upsert({
		where: {
			routeId_collectionPointId: {
				routeId: route2.id,
				collectionPointId: 'c942468c-7432-47e9-8c80-2d0d8dab742c',
			},
		},
		create: {
			routeId: route2.id,
			collectionPointId: 'c942468c-7432-47e9-8c80-2d0d8dab742c',
		},
		update: {},
	});

	await prisma.routesCollectionPoints.upsert({
		where: {
			routeId_collectionPointId: {
				routeId: route2.id,
				collectionPointId: '71bb73d3-6a0c-4a08-b168-a872cf33ee45',
			},
		},
		create: {
			routeId: route2.id,
			collectionPointId: '71bb73d3-6a0c-4a08-b168-a872cf33ee45',
		},
		update: {},
	});

	const route3 = await prisma.routes.upsert({
		where: {
			id: 'f0a1c16c-fae4-497d-8a2f-a64e03de2870',
		},
		create: {
			id: 'f0a1c16c-fae4-497d-8a2f-a64e03de2870',
			name: 'Rota 3',
			status: 'PENDING',
			totalDistanceKm: 40,
			totalTimeMs: 14400000,
			date: '2024-12-16T12:00:00.000Z',
			collections: {
				create: [
					{
						status: CollectionStatus.enum.PENDING,
						date: '2024-12-16T12:00:00.000Z',
						volumeCollected: 0,
						collectionPoint: {
							create: {
								id: 'dc9d96d9-21d3-4dcb-bb5b-d8afa3868aae',
								name: 'Edifício Residencial Praia do Meio',
								type: 'APARTMENT',
								status: CollectionPointStatus.enum.ACTIVE,
								address: JSON.stringify({
									state: 'SP',
									city: 'Sao Paulo',
									zipcode: '04026-000',
									number: '123',
									district: 'Vila Mariana',
									street: 'Rua Lorem Ipsum',
									complement: 'Entrada Sul',
									coordinate: { latitude: -8.050177, longitude: -34.880589 },
								}),
								bestCollectionDay: JSON.stringify(['FRIDAY']),
								selectiveCollectionDay: JSON.stringify(['FRIDAY']),
								contact: JSON.stringify({
									name: 'Matias Castro',
									position: 'Responsável pela coleta',
									phone: '1234567890',
									email: 'H9k5y@example.com',
								}),
								weeklyGlassVolume: 1000,
								operatorId: operator.id,
							},
						},
					},
					{
						status: CollectionStatus.enum.PENDING,
						date: '2024-12-16T12:00:00.000Z',
						volumeCollected: 0,
						collectionPoint: {
							create: {
								id: '7e1b4c8f-3a59-4f2d-8c6e-b1f9c7d3a2b4',
								name: 'Edifício Residencial Praia do Meio',
								type: 'APARTMENT',
								status: CollectionPointStatus.enum.ACTIVE,
								address: JSON.stringify({
									state: 'SP',
									city: 'Sao Paulo',
									zipcode: '04026-000',
									number: '123',
									district: 'Vila Mariana',
									street: 'Rua Lorem Ipsum',
									complement: 'Entrada Sul',
									coordinate: { latitude: -8.050878, longitude: -34.879666 },
								}),
								bestCollectionDay: JSON.stringify(['FRIDAY']),
								selectiveCollectionDay: JSON.stringify(['FRIDAY']),
								contact: JSON.stringify({
									name: 'Matias Castro',
									position: 'Responsável pela coleta',
									phone: '1234567890',
									email: 'H9k5y@example.com',
								}),
								weeklyGlassVolume: 1000,
								operatorId: operator.id,
							},
						},
					},

					{
						status: CollectionStatus.enum.PENDING,
						date: '2024-12-16T12:00:00.000Z',
						volumeCollected: 0,
						collectionPoint: {
							create: {
								id: '262aba14-1c09-4aa9-9758-e558863363bc',
								name: 'Edifício Residencial Nimbus',
								type: 'APARTMENT',
								status: CollectionPointStatus.enum.ACTIVE,
								address: JSON.stringify({
									state: 'SP',
									city: 'Sao Paulo',
									zipcode: '04026-000',
									number: '123',
									district: 'Vila Mariana',
									street: 'Rua Lorem Ipsum',
									complement: 'Entrada Sul',
									coordinate: { latitude: -8.052834, longitude: -34.882599 },
								}),
								bestCollectionDay: JSON.stringify(['FRIDAY']),
								selectiveCollectionDay: JSON.stringify(['FRIDAY']),
								contact: JSON.stringify({
									name: 'Matias Castro',
									position: 'Responsável pela coleta',
									phone: '1234567890',
									email: 'H9k5y@example.com',
								}),
								weeklyGlassVolume: 1000,
								operatorId: operator.id,
							},
						},
					},
				],
			},
		},
		update: {},
	});

	await prisma.routesCollectionPoints.upsert({
		where: {
			routeId_collectionPointId: {
				routeId: route3.id,
				collectionPointId: 'dc9d96d9-21d3-4dcb-bb5b-d8afa3868aae',
			},
		},
		create: {
			routeId: route3.id,
			collectionPointId: 'dc9d96d9-21d3-4dcb-bb5b-d8afa3868aae',
		},
		update: {},
	});

	await prisma.routesCollectionPoints.upsert({
		where: {
			routeId_collectionPointId: {
				routeId: route3.id,
				collectionPointId: '7e1b4c8f-3a59-4f2d-8c6e-b1f9c7d3a2b4',
			},
		},
		create: {
			routeId: route3.id,
			collectionPointId: '7e1b4c8f-3a59-4f2d-8c6e-b1f9c7d3a2b4',
		},
		update: {},
	});

	await prisma.routesCollectionPoints.upsert({
		where: {
			routeId_collectionPointId: {
				routeId: route3.id,
				collectionPointId: '262aba14-1c09-4aa9-9758-e558863363bc',
			},
		},
		create: {
			routeId: route3.id,
			collectionPointId: '262aba14-1c09-4aa9-9758-e558863363bc',
		},
		update: {},
	});

	logger.info('adding collection point to database', {
		id: '97f2ab4c-ef96-42a5-9da8-395f236c875e',
		routeId: 'f7f16595-8537-486b-9027-ee419435980c',
	});

	logger.info('checking database contents');

	const vehicles = await prisma.vehicles.findMany();
	logger.info('checking vehicles', { vehicles });

	const users = await prisma.users.findMany();
	logger.info('checking users', { users });

	const routes = await prisma.routes.findMany();
	logger.info('checking routes', { routes });

	const collectionPoints = await prisma.collectionPoints.findMany();
	logger.info('checking collection points', { collectionPoints });

	logger.info(`the daatabase is ok in ${DATABASE_URL} `);
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async e => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
