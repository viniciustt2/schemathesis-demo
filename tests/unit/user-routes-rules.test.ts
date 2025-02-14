import { RoutesMockRepository } from '../../src/infra/repositories/routes-mock-repository';
import { UserRoutesRules } from '../../src/domain/services/user-service';
import { BusinessRuleViolationProblem } from '../../src/infra/errors/business-rule-violation';

describe('[unit] User route rules', () => {
	// PET-205
	it('should ensure has single route in progress', () => {
		expect.hasAssertions();
		const routesRepository = new RoutesMockRepository(false);

		const result = new UserRoutesRules(routesRepository).ensureHasSingleRouteInProgress(
			'f7f16595-8537-486b-9027-ee419435980c',
		);

		expect(result).resolves.toBeUndefined();
	});
	it('should not ensure has single route in progress', () => {
		expect.hasAssertions();
		const routesRepository = new RoutesMockRepository(true);

		const result = new UserRoutesRules(routesRepository).ensureHasSingleRouteInProgress(
			'f7f16595-8537-486b-9027-ee419435980c',
		);

		expect(result).rejects.toThrowError(BusinessRuleViolationProblem);
	});
});
