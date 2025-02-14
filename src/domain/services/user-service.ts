import { BusinessRuleViolationProblem } from './../../infra/errors/business-rule-violation';
import type { RoutesRepository } from '../repositories/routes-repository';

export class UserRoutesRules {
	constructor(private routesRepository: RoutesRepository) {}

	async ensureHasSingleRouteInProgress(userId: string) {
		const hasRoutesInProgress = await this.routesRepository.hasRoutesInProgressByUser(userId);

		if (hasRoutesInProgress) {
			throw BusinessRuleViolationProblem.error('Só pode haver uma rota em andamento por usuário', 'userId');
		}
	}
}
