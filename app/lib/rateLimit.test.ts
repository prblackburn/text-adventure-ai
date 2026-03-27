import { describe, it, expect, beforeEach } from 'vitest';
import { isRateLimited } from './rateLimit';

const RATE_LIMIT_REQUESTS = 20;

function makeMockKV(): KVNamespace {
	const store = new Map<string, string>();
	return {
		get: async (key: string) => store.get(key) ?? null,
		put: async (key: string, value: string) => { store.set(key, value); },
		delete: async (key: string) => { store.delete(key); },
		list: async () => ({ keys: [], list_complete: true, caret: undefined }),
		getWithMetadata: async (key: string) => ({ value: store.get(key) ?? null, metadata: null }),
	} as unknown as KVNamespace;
}

describe('isRateLimited', () => {
	let kv: KVNamespace;
	const ip = '1.2.3.4';

	beforeEach(() => {
		kv = makeMockKV();
	});

	it('returns false on the first request', async () => {
		expect(await isRateLimited(kv, ip)).toBe(false);
	});

	it('returns false below the request limit', async () => {
		for (let i = 0; i < RATE_LIMIT_REQUESTS - 1; i++) {
			expect(await isRateLimited(kv, ip)).toBe(false);
		}
	});

	it('returns true once the limit is reached', async () => {
		for (let i = 0; i < RATE_LIMIT_REQUESTS; i++) {
			await isRateLimited(kv, ip);
		}
		expect(await isRateLimited(kv, ip)).toBe(true);
	});

	it('increments the counter on each call', async () => {
		await isRateLimited(kv, ip);
		await isRateLimited(kv, ip);
		const raw = await kv.get(`rl:${ip}`);
		expect(raw).toBe('2');
	});

	it('tracks different IPs independently', async () => {
		const ip2 = '9.9.9.9';
		for (let i = 0; i < RATE_LIMIT_REQUESTS; i++) {
			await isRateLimited(kv, ip);
		}
		// ip is now rate-limited; ip2 should still be allowed
		expect(await isRateLimited(kv, ip)).toBe(true);
		expect(await isRateLimited(kv, ip2)).toBe(false);
	});
});
