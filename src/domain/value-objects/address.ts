import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { Coordinates } from './coordinates';
extendZodWithOpenApi(z);

export type AddressType = z.infer<typeof Address.schema>;
export class Address {
	readonly street: string;
	readonly complement?: string;
	readonly zipcode: string;
	readonly number: string;
	readonly district: string;
	readonly city: string;
	readonly state: string;
	readonly coordinate?: Coordinates;

	static readonly schema = z
		.object({
			street: z.string().describe('Rua do endereço'),
			complement: z.string().optional().describe('Complemento do endereço (opcional)'),
			zipcode: z.string().describe('CEP do endereço'),
			number: z.string().describe('Número do endereço'),
			district: z.string().describe('Bairro do endereço'),
			city: z.string().describe('Cidade do endereço'),
			state: z.string().describe('Estado do endereço'),
			coordinate: Coordinates.schema.optional().describe('Coordenadas geográficas do endereço'),
		})
		.openapi('Address', {
			description: 'Representa um endereço completo com informações geográficas',
		});

	private constructor(address: AddressType) {
		this.street = address.street;
		this.complement = address.complement;
		this.coordinate = Coordinates.maybeCreate(address.coordinate);
		this.city = address.city;
		this.district = address.district;
		this.zipcode = address.zipcode;
		this.state = address.state;
		this.number = address.number;
	}

	static create(address: AddressType) {
		return new Address(address);
	}

	static fromUnknown(unknown: unknown): Address {
		const data = Address.schema.parse(unknown);
		return new Address(data);
	}

	static fromJSON(json: string): Address {
		const unknown = JSON.parse(json);
		const data = Address.schema.parse(unknown);
		return new Address(data);
	}

	serialize() {
		return {
			city: this.city,
			district: this.district,
			zipcode: this.zipcode,
			state: this.state,
			number: this.number,
			street: this.street,
			complement: this.complement,
			coordinate: this.coordinate?.serialize(),
		};
	}
}
