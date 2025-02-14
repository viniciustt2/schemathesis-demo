import type { Entry, Geocoder } from 'node-geocoder';
import type { GeocodeResponse, GeocodingProvider, GeoLocation } from './geocoding';

export class NodeGeocoderAdapter implements GeocodingProvider {
	constructor(private geocoder: Geocoder) {}

	private mapEntriesToResponses(entries: Entry[]): GeocodeResponse[] {
		const responses: GeocodeResponse[] = [];
		for (const entry of entries) {
			if (!entry.latitude || !entry.longitude) continue;
			responses.push({
				location: { lat: entry.latitude, lon: entry.longitude },
				address: {
					formattedAddress: entry.formattedAddress,
					country: entry.country,
					countryCode: entry.countryCode,
					city: entry.administrativeLevels?.level2long,
					state: entry.administrativeLevels?.level1long,
					district: getNeighborhood(entry),
					county: entry.county,
					number: entry.streetNumber,
					postCode: entry.zipcode,
					street: entry.streetName,
				},
			});
		}
		return responses;
	}

	async geocode(address: string): Promise<GeocodeResponse[]> {
		try {
			return await this.geocoder.geocode({ address, countryCode: 'BR', limit: 10 }).then(this.mapEntriesToResponses);
		} catch {
			return [];
		}
	}

	async reverseGeocode(location: GeoLocation): Promise<GeocodeResponse[]> {
		try {
			return await this.geocoder.reverse(location).then(this.mapEntriesToResponses);
		} catch {
			return [];
		}
	}
}

function hasNeighborhood(extra: Record<string, unknown> | undefined): extra is { neighborhood: string } {
	return typeof extra === 'object' && extra !== null && 'neighborhood' in extra;
}

function getNeighborhood(entry: Entry): string | undefined {
	const { extra, administrativeLevels } = entry;
	const city = administrativeLevels?.level2long;
	if (hasNeighborhood(extra) && extra.neighborhood !== city) {
		return extra.neighborhood;
	}
	return undefined;
}
