const RATE_LIMIT_REQUESTS = 20; // max requests per window
const RATE_LIMIT_WINDOW_SECONDS = 60; // rolling window in seconds

export async function isRateLimited(kv: KVNamespace, ip: string): Promise<boolean> {
	const key = `rl:${ip}`;
	const raw = await kv.get(key);
	const count = raw ? parseInt(raw, 10) : 0;
	if (count >= RATE_LIMIT_REQUESTS) return true;
	await kv.put(key, String(count + 1), { expirationTtl: RATE_LIMIT_WINDOW_SECONDS });
	return false;
}
