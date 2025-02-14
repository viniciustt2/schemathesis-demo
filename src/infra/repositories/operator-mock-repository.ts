import { Operator } from '../../domain/entities/operator';
import type { OperatorRepository } from '../../domain/repositories/operator-repository';

export class OperatorMockRepository implements OperatorRepository {
	async getById(id: string): Promise<Operator | null> {
		return Operator.create({
			name: 'Operador 1',
			cep: '12345-678',
			cnpj: '12.345.678/0001-00',
			contact: 'Contato 1',
			phone: '(11) 11111-1111',
			email: 'w5kYK@example.com',
			documents: {
				cnpjFile: 'https://example.com/cnpj.pdf',
				municipalRegistrationFile: 'https://example.com/municipal-registration.pdf',
				environmentalLicenseFile: 'https://example.com/environmental-license.pdf',
				operationLicenseFile: 'https://example.com/operation-license.pdf',
			},
			status: 'ACTIVE',
			id,
		});
	}
}
