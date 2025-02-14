/**
 * Represents a geographical location with latitude and longitude.
 */
export interface GeoLocation {
	lat: number;
	lon: number;
}

export interface GeocodeAddress {
	/**
	 * The address formatted as a single string
	 */
	readonly formattedAddress?: string | undefined;
	/**
	 * The Street of the address, can also be an avenue, etc (rua)
	 */
	readonly street?: string | undefined;
	/**
	 * The city of the address (cidade)
	 */
	readonly city?: string | undefined;
	/**
	 * The district of the address (bairro)
	 */
	readonly district?: string | undefined;
	/**
	 * The postal code of the address (CEP)
	 */
	readonly postCode?: string | undefined;
	/**
	 * The county of the address
	 */
	readonly county?: string | undefined;
	/**
	 * The state of the address (estado)
	 */
	readonly state?: string | undefined;
	/**
	 * The country of the address (país)
	 */
	readonly country?: string | undefined;
	/**
	 * The code of the country as two letters
	 */
	readonly countryCode?: string | undefined;
	/**
	 * The number of the address (numero da casa, prédio, etc)
	 */
	readonly number?: string | undefined;
	/**
	 * Geographical coordinates of the address
	 */
	readonly coordinate?: GeoLocation | undefined;
}

/**
 * Represents a single geocoding result, used for both geocode and reverse geocode
 * responses.
 */
export interface GeocodeResponse {
	address: GeocodeAddress;
	location: GeoLocation;
}

// Geocoding Provider Interface

/**
 * Interface for Geocoding services to implement.
 * Supports forward geocoding and reverse geocoding with the same response structure.
 */
export interface GeocodingProvider {
	/**
	 * Converts an address into geographic coordinates.
	 * @param query The quey of the address to geocode.
	 * @returns The geocoding response containing results with the address and
	 * geographic location for each.
	 */
	geocode(query: string): Promise<GeocodeResponse[]>;

	/**
	 * Converts geographic coordinates into an address.
	 * @param location The geographical location (latitude, longitude) to reverse
	 * geocode.
	 * @returns The geocoding response containing results with the address and
	 * geographic location for each.
	 */
	reverseGeocode(location: GeoLocation): Promise<GeocodeResponse[]>;
}
