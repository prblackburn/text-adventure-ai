import { describe, it, expect } from 'vitest';
import { SEEDS, generateSeed } from './worldSeed';

describe('SEEDS', () => {
	it('contains exactly 3 themes', () => {
		expect(SEEDS).toHaveLength(3);
	});

	it.each(SEEDS.map((s, i) => [i, s] as const))('seed %i has all required fields', (_i, seed) => {
		expect(seed.theme).toBeTruthy();
		expect(seed.setting).toBeTruthy();
		expect(seed.protagonist).toBeTruthy();
		expect(seed.hook).toBeTruthy();
	});

	it('has unique themes', () => {
		const themes = SEEDS.map((s) => s.theme);
		expect(new Set(themes).size).toBe(themes.length);
	});

	it('includes noir detective theme', () => {
		expect(SEEDS.some((s) => s.theme === 'noir detective')).toBe(true);
	});

	it('includes fantasy dungeon theme', () => {
		expect(SEEDS.some((s) => s.theme === 'fantasy dungeon')).toBe(true);
	});

	it('includes sci-fi colony theme', () => {
		expect(SEEDS.some((s) => s.theme === 'sci-fi colony')).toBe(true);
	});
});

describe('generateSeed', () => {
	it('returns the seed at the given index', () => {
		for (let i = 0; i < SEEDS.length; i++) {
			const { seed, ruleIndex } = generateSeed(i);
			expect(seed).toBe(SEEDS[i]);
			expect(ruleIndex).toBe(i);
		}
	});

	it('returns a valid seed when called with no index', () => {
		const { seed, ruleIndex } = generateSeed();
		expect(SEEDS).toContain(seed);
		expect(ruleIndex).toBeGreaterThanOrEqual(0);
		expect(ruleIndex).toBeLessThan(SEEDS.length);
	});

	it('returns consistent ruleIndex and seed', () => {
		const { seed, ruleIndex } = generateSeed();
		expect(seed).toBe(SEEDS[ruleIndex]);
	});
});
