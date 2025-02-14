import type { Operator } from '../entities/operator';

export interface OperatorRepository {
	getById(id: string): Promise<Operator | null>;
}
