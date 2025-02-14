function uncapitalize(string: string | undefined) {
	if (!string?.[0]) return '';
	return string[0].toLowerCase() + string.slice(1);
}

/**
 * @param message Message of an error of code 2025
 * @returns The name of the model that triggered the error
 */
export function extractModelFromMessageP2025(message: string) {
	const words = message.split(' ');
	const modelName = words[1];
	return uncapitalize(modelName);
}
