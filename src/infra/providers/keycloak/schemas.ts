import { z } from 'zod';
export type Credentials = z.infer<typeof fetchTokenResponseSchema>;
export const fetchTokenResponseSchema = z.object({
	access_token: z.string(),
	expires_in: z.number(),
	token_type: z.string(),
	scope: z.string(),
});
