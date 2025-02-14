import type { GeocodeResponse, GeocodingProvider, GeoLocation } from './geocoding';

export class MockGeocodingProvider implements GeocodingProvider {
	async geocode(_query: string): Promise<GeocodeResponse[]> {
		return [
			{
				location: { lat: -8.056321329417743, lon: -34.88263146088477 },
				address: {
					street: 'Avenida Cruz Cabugá',
					city: 'Recife',
					postCode: '50040-000',
					state: 'Pernambuco',
					country: 'Brasil',
				},
			},
		];
	}

	async reverseGeocode(_location: GeoLocation): Promise<GeocodeResponse[]> {
		return [
			{
				location: { lat: -8.056321329417743, lon: -34.88263146088477 },
				address: {
					street: 'Avenida Cruz Cabugá',
					city: 'Recife',
					postCode: '50040-000',
					state: 'Pernambuco',
					country: 'Brasil',
				},
			},
		];
	}
}
