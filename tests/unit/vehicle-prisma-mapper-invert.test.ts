import { VehiclesPrismaMapper } from '../../src/infra/repositories/vehicles-prisma-repository';
import { Vehicle } from '../../src/domain/entities/vehicle';

type ToEntityInputType = Parameters<typeof VehiclesPrismaMapper.toEntity>[0];
describe('Invert vehicle prisma mapper', () => {
	beforeEach(() => {
		vi.useFakeTimers({ now: new Date('2025-01-06T10:20:30.000Z') });
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('should be invertible', () => {
		const vehicle = Vehicle.create({ id: 'ed3f0cc6-8836-4483-a2a3-b510f5fc6e8e', name: 'TRIVIM 1' });
		const inverse = VehiclesPrismaMapper.fromEntity(vehicle) as ToEntityInputType;
		const reverse = VehiclesPrismaMapper.toEntity(inverse);
		expect(reverse.serialize()).toEqual(vehicle.serialize());
	});
});
