import { describe, it, expect } from 'vitest';
import { RULES, getRules } from './worldRules';
import { SEEDS } from './worldSeed';

const BEAT_COUNT = 5; // beats 0–4

describe('RULES', () => {
	it('has one entry per seed theme', () => {
		expect(RULES).toHaveLength(SEEDS.length);
	});

	it.each(RULES.map((r, i) => [i, r] as const))('rules[%i] has a non-empty global array', (_i, rules) => {
		expect(Array.isArray(rules.global)).toBe(true);
		expect(rules.global.length).toBeGreaterThan(0);
	});

	it.each(RULES.map((r, i) => [i, r] as const))('rules[%i] has scenes for all 5 beats', (_i, rules) => {
		for (let beat = 0; beat < BEAT_COUNT; beat++) {
			expect(rules.scenes[beat]).toBeDefined();
		}
	});

	it.each(
		RULES.flatMap((rules, ri) =>
			Array.from({ length: BEAT_COUNT }, (_, beat) => [ri, beat, rules.scenes[beat]] as const),
		),
	)('rules[%i] scene[%i] has required BeatScene fields', (_ri, _beat, scene) => {
		expect(Array.isArray(scene!.items)).toBe(true);
		expect(Array.isArray(scene!.characters)).toBe(true);
		expect(Array.isArray(scene!.exits)).toBe(true);
		expect(Array.isArray(scene!.constraints)).toBe(true);
		expect(Array.isArray(scene!.completionConditions)).toBe(true);
	});

	it.each(
		RULES.flatMap((rules, ri) =>
			Array.from({ length: BEAT_COUNT }, (_, beat) => [ri, beat, rules.scenes[beat]] as const),
		),
	)('rules[%i] scene[%i] has at least one exit', (_ri, _beat, scene) => {
		expect(scene!.exits.length).toBeGreaterThan(0);
	});

	it.each(
		RULES.flatMap((rules, ri) =>
			// Beat 4 (Resolution) is the final beat and has no completion conditions by design
			Array.from({ length: BEAT_COUNT - 1 }, (_, beat) => [ri, beat, rules.scenes[beat]] as const),
		),
	)('rules[%i] scene[%i] has at least one completion condition', (_ri, _beat, scene) => {
		expect(scene!.completionConditions.length).toBeGreaterThan(0);
	});

	it('completion condition ids are unique within each ruleset', () => {
		for (const rules of RULES) {
			const ids = Object.values(rules.scenes).flatMap((scene) => scene!.completionConditions.map((c) => c.id));
			expect(new Set(ids).size).toBe(ids.length);
		}
	});
});

describe('getRules', () => {
	it('returns the correct ruleset for each valid index', () => {
		for (let i = 0; i < RULES.length; i++) {
			expect(getRules(i)).toBe(RULES[i]);
		}
	});

	it('falls back to RULES[0] for an out-of-range index', () => {
		expect(getRules(999)).toBe(RULES[0]);
	});
});
