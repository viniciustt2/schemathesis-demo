export interface FileStorage {
	/**
	 * Loads the content of a file synchronously
	 * @param path Path to the file, it can be a local path or a remote path.
	 * @throws FileNotFoundError if the file does not exist
	 */
	load(path: string): string | Buffer;

	/**
	 * Saves the content of a file synchronously
	 * @param path Path to write the file, it can be a local path or a remote
	 * path
	 * @param content Content to write to the file
	 * @param append If true, and the file exists, appends to the file. If false
	 * and the file exists, overwrites the file. The default behavior is overriding.
	 */
	save(path: string, content: string, append?: boolean): string | Buffer;
}

export interface AsyncFileStorage {
	/**
	 * Loads the content of a file asynchronously
	 * @param path Path to the file, it can be a local path or a remote path.
	 * @rejects with FileNotFoundError if the file does not exist
	 */
	loadAsync(path: string): Promise<string | Buffer>;

	/**
	 * Saves the content of a file asynchronously
	 * @param path Path to write the file, it can be a local path or a remote
	 * path
	 * @param content Content to write to the file
	 * @param append If true, and the file exists, appends to the file. If false
	 * and the file exists, overwrites the file.
	 */
	saveAsync(path: string, content: string | Buffer, append?: boolean): Promise<string | Buffer>;

	/**
	 * Saves the content of a file asynchronously
	 * @param path Path to write the file, it can be a local path or a remote
	 * path
	 * @param content Content to write to the file
	 * @param append If true, and the file exists, appends to the file. If false
	 * and the file exists, overwrites the file.
	 */
	deleteAsync(path: string): Promise<string | Buffer>;
}
