import { z } from 'zod';

export type OperatorType = z.infer<typeof Operator.schema>;
export class Operator {
	id: string;
	name: string;
	cep: string;
	cnpj: string;
	contact: string;
	phone: string;
	email: string;
	documents: {
		cnpjFile?: string;
		municipalRegistrationFile?: string;
		environmentalLicenseFile?: string;
		operationLicenseFile?: string;
	};
	status: 'ACTIVE' | 'INACTIVE';

	static schema = z.object({
		id: z.string().uuid(),
		name: z.string().min(1, 'O nome do operador é obrigatório.'),
		cep: z.string().regex(/^\d{5}-\d{3}$/, 'CEP inválido.'),
		cnpj: z.string().regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, 'CNPJ inválido.'),
		contact: z.string().min(1, 'O contato é obrigatório.'),
		phone: z.string().regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Telefone inválido.'),
		email: z.string().email('E-mail inválido.'),
		documents: z.object({
			cnpjFile: z.string().url().optional(),
			municipalRegistrationFile: z.string().url().optional(),
			environmentalLicenseFile: z.string().url().optional(),
			operationLicenseFile: z.string().url().optional(),
		}),
		status: z.enum(['ACTIVE', 'INACTIVE']).optional().default('INACTIVE'),
	});

	constructor(operator: OperatorType) {
		this.id = operator.id;
		this.name = operator.name;
		this.cep = operator.cep;
		this.cnpj = operator.cnpj;
		this.contact = operator.contact;
		this.phone = operator.phone;
		this.email = operator.email;
		this.documents = operator.documents;
		this.status = operator.status;
	}

	static create(operator: Optional<OperatorType, 'id'>): Operator {
		return new Operator({
			id: operator.id ?? crypto.randomUUID(),
			name: operator.name,
			cep: operator.cep,
			cnpj: operator.cnpj,
			contact: operator.contact,
			phone: operator.phone,
			email: operator.email,
			documents: operator.documents,
			status: operator.status ?? 'INACTIVE',
		});
	}
}
