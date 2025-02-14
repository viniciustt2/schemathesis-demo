import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { CollectionPointStatus } from '../value-objects/collection-point-status';
import { Address } from '../value-objects/address';
import { Contact } from '../value-objects/contact';
import { Responsible } from '../value-objects/responsible';
import { PaginationSchema } from '../../infra/providers/pagination/pagination';
import { CollectionPointType as CollectionPointTypeVO } from '../value-objects/collection-point-type';
import { Shift } from '../value-objects/shift';
import { Weekday } from '../value-objects/week-day';

extendZodWithOpenApi(z);

export type CollectionPointType = z.infer<typeof CollectionPoint.schema>;

export class CollectionPoint {
	readonly id: string;
	readonly name: string;
	readonly responsible?: Responsible;
	readonly type: CollectionPointTypeVO;
	readonly address: Address;
	#status: CollectionPointStatus;
	readonly contact: Contact;
	readonly weeklyGlassVolume?: number;
	readonly bestCollectionDay?: Weekday[];
	readonly shifts?: Shift[];
	readonly selectiveCollectionDay?: Weekday[];
	readonly operatorId: string;
	readonly relevantInfos?: string;

	get status() {
		return this.#status;
	}

	// Schema para validação e documentação
	static readonly schema = z
		.object({
			id: z.string().uuid().openapi('CollectionPointId', {
				description: 'UUID4 do ponto de coleta',
				example: '361754a6-845b-419b-8f96-be1f01fa899e',
			}),
			name: z.string().describe('Nome do ponto de coleta'),
			responsible: Responsible.schema.optional().describe('Responsável do ponto de coleta'),
			type: CollectionPointTypeVO.schema.describe('Tipo do ponto de coleta'),
			address: Address.schema.describe('Endereço do ponto de coleta'),
			status: CollectionPointStatus.schema.describe('Estado do ponto de coleta'),
			contact: Contact.schema.describe('Informações de contato do ponto de coleta'),
			weeklyGlassVolume: z.number().optional().describe('Volume de vidro semanal (em garrafas)'),
			bestCollectionDay: Weekday.schema.array().optional().describe('Melhor dia da semana para a coleta'),
			selectiveCollectionDay: Weekday.extendedSchema
				.array()
				.optional()
				.describe('Dia da coleta seletiva (prefeitura/empresa)'),
			shifts: Shift.schema.array().optional().describe('Melhor período para a coleta'),
			operatorId: z.string().uuid().describe('UUID4 do operador a que esse ponto de coleta pertence'),
			relevantInfos: z.string().optional().describe('Informações relevantes para o ponto de coleta'),
		})
		.openapi('CollectionPoint', { description: 'Um ponto de coleta de resíduo de vidro' });

	static readonly paginatedSchema = z.object({
		data: CollectionPoint.schema.array(),
		pagination: PaginationSchema,
	});

	private constructor(collectionPoint: CollectionPointType) {
		this.id = collectionPoint.id;
		this.name = collectionPoint.name;
		this.responsible = Responsible.maybeCreate(collectionPoint.responsible);
		this.type = CollectionPointTypeVO.create(collectionPoint.type);
		this.address = Address.create(collectionPoint.address);
		this.#status = CollectionPointStatus.create(collectionPoint.status);
		this.shifts = collectionPoint.shifts?.map(shift => Shift.create(shift));
		this.contact = Contact.create(collectionPoint.contact);
		this.weeklyGlassVolume = collectionPoint.weeklyGlassVolume;
		this.bestCollectionDay = Weekday.maybeCreate(collectionPoint.bestCollectionDay);
		this.selectiveCollectionDay = Weekday.maybeCreateExtended(collectionPoint.selectiveCollectionDay);
		this.operatorId = collectionPoint.operatorId;
		this.relevantInfos = collectionPoint.relevantInfos;
	}

	static create(collectionPoint: Optional<CollectionPointType, 'id'>) {
		return new CollectionPoint({
			id: collectionPoint.id ?? crypto.randomUUID(),
			name: collectionPoint.name,
			responsible: collectionPoint.responsible,
			type: collectionPoint.type,
			relevantInfos: collectionPoint.relevantInfos,
			shifts: collectionPoint.shifts,
			address: collectionPoint.address,
			status: collectionPoint.status,
			contact: collectionPoint.contact,
			weeklyGlassVolume: collectionPoint.weeklyGlassVolume,
			bestCollectionDay: collectionPoint.bestCollectionDay,
			selectiveCollectionDay: collectionPoint.selectiveCollectionDay,
			operatorId: collectionPoint.operatorId,
		});
	}

	static fromUnknown(unknown: unknown): CollectionPoint {
		const data = CollectionPoint.schema.parse(unknown);
		return new CollectionPoint(data);
	}

	serialize() {
		return {
			id: this.id,
			name: this.name,
			address: this.address.serialize(),
			status: this.#status.serialize(),
			contact: this.contact.serialize(),
			type: this.type.serialize(),
			shifts: this.shifts?.map(shift => shift.serialize()),
			bestCollectionDay: this.bestCollectionDay?.map(day => day.serialize()),
			selectiveCollectionDay: this.selectiveCollectionDay?.map(day => day.serialize()),
			weeklyGlassVolume: this.weeklyGlassVolume,
			responsible: this.responsible?.serialize(),
			operatorId: this.operatorId,
		};
	}
}
