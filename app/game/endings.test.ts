import { describe, it, expect } from 'vitest';
import { determineEndingPath, getEndingMeta, ENDING_METADATA } from './endings';
import type { NpcStateMap } from './types';

describe('determineEndingPath', () => {
	describe('noir (ruleIndex 0)', () => {
		it('returns gundown when loaded revolver is in inventory', () => {
			expect(determineEndingPath(0, {}, ['loaded revolver'])).toBe('gundown');
		});

		it('returns gundown case-insensitively for Loaded Revolver', () => {
			expect(determineEndingPath(0, {}, ['Loaded Revolver'])).toBe('gundown');
		});

		it('returns gundown when revolver is among other items', () => {
			expect(determineEndingPath(0, {}, ['hotel key', 'loaded revolver', 'matchbook'])).toBe('gundown');
		});

		it('returns arrest when inventory is empty', () => {
			expect(determineEndingPath(0, {}, [])).toBe('arrest');
		});

		it('returns arrest when inventory has items but no revolver', () => {
			expect(determineEndingPath(0, {}, ['blue envelope', 'incriminating ledger'])).toBe('arrest');
		});

		it('ignores npcState for noir — only inventory matters', () => {
			const npcState: NpcStateMap = { 'Viktor Crane': { disposition: -2, interactionCount: 3 } };
			expect(determineEndingPath(0, npcState, [])).toBe('arrest');
		});
	});

	describe('dungeon (ruleIndex 1)', () => {
		it('returns conqueror when Warden disposition is -1 (any combat attempt)', () => {
			const npcState: NpcStateMap = { 'The Warden': { disposition: -1, interactionCount: 1 } };
			expect(determineEndingPath(1, npcState, [])).toBe('conqueror');
		});

		it('returns conqueror when Warden disposition is -2', () => {
			const npcState: NpcStateMap = { 'The Warden': { disposition: -2, interactionCount: 3 } };
			expect(determineEndingPath(1, npcState, [])).toBe('conqueror');
		});

		it('returns honored when Warden disposition is 0 and obsidian key in inventory', () => {
			const npcState: NpcStateMap = { 'The Warden': { disposition: 0, interactionCount: 1 } };
			expect(determineEndingPath(1, npcState, ['obsidian key'])).toBe('honored');
		});

		it('returns honored when inventory contains obsidian key (Warden neutral)', () => {
			expect(determineEndingPath(1, {}, ['torch', 'obsidian key', 'rope'])).toBe('honored');
		});

		it('returns honored case-insensitively for obsidian key', () => {
			expect(determineEndingPath(1, {}, ['Obsidian Key'])).toBe('honored');
		});

		it('returns default when Warden disposition is not -2 and no obsidian key', () => {
			const npcState: NpcStateMap = { 'The Warden': { disposition: 0, interactionCount: 1 } };
			expect(determineEndingPath(1, npcState, ['silver compass', 'torch'])).toBe('default');
		});

		it('returns default when npcState is empty and no obsidian key', () => {
			expect(determineEndingPath(1, {}, [])).toBe('default');
		});

		it('conqueror takes priority over honored even when obsidian key present', () => {
			const npcState: NpcStateMap = { 'The Warden': { disposition: -2, interactionCount: 4 } };
			expect(determineEndingPath(1, npcState, ['obsidian key'])).toBe('conqueror');
		});
	});

	describe('sci-fi (ruleIndex 2)', () => {
		it('returns partnership when Dr. Osei disposition is 1', () => {
			const npcState: NpcStateMap = { 'Dr. Osei': { disposition: 1, interactionCount: 2 } };
			expect(determineEndingPath(2, npcState, [])).toBe('partnership');
		});

		it('returns partnership when Dr. Osei disposition is 2', () => {
			const npcState: NpcStateMap = { 'Dr. Osei': { disposition: 2, interactionCount: 4 } };
			expect(determineEndingPath(2, npcState, [])).toBe('partnership');
		});

		it('returns default when Dr. Osei disposition is 0', () => {
			const npcState: NpcStateMap = { 'Dr. Osei': { disposition: 0, interactionCount: 1 } };
			expect(determineEndingPath(2, npcState, [])).toBe('default');
		});

		it('returns default when Dr. Osei disposition is negative', () => {
			const npcState: NpcStateMap = { 'Dr. Osei': { disposition: -1, interactionCount: 1 } };
			expect(determineEndingPath(2, npcState, [])).toBe('default');
		});

		it('returns default when npcState is empty', () => {
			expect(determineEndingPath(2, {}, [])).toBe('default');
		});
	});

	describe('unknown ruleIndex', () => {
		it('returns default for undefined', () => {
			expect(determineEndingPath(undefined, {}, [])).toBe('default');
		});

		it('returns default for out-of-range index', () => {
			expect(determineEndingPath(99, {}, [])).toBe('default');
		});
	});
});

describe('getEndingMeta', () => {
	it('returns correct metadata for noir gundown', () => {
		const meta = getEndingMeta(0, 'gundown');
		expect(meta.title).toBe('The Hard Way');
		expect(meta.tagline).toBeTruthy();
	});

	it('returns correct metadata for noir arrest', () => {
		const meta = getEndingMeta(0, 'arrest');
		expect(meta.title).toBe('Justice Served');
	});

	it('returns correct metadata for dungeon conqueror', () => {
		const meta = getEndingMeta(1, 'conqueror');
		expect(meta.title).toBe('The Stone Broken');
	});

	it('returns correct metadata for scifi partnership', () => {
		const meta = getEndingMeta(2, 'partnership');
		expect(meta.title).toBe('A New Horizon');
	});

	it('falls back gracefully for unknown endingPath', () => {
		const meta = getEndingMeta(0, 'nonexistent');
		expect(meta.title).toBe('The End');
		expect(meta.tagline).toBe('');
	});

	it('falls back gracefully for undefined ruleIndex', () => {
		const meta = getEndingMeta(undefined, 'default');
		expect(meta.title).toBe('The End');
	});
});

describe('ENDING_METADATA completeness', () => {
	it('every theme has a default path', () => {
		for (const [index, variants] of Object.entries(ENDING_METADATA)) {
			expect(variants['default'], `ruleIndex ${index} missing default ending`).toBeDefined();
		}
	});

	it('every ending entry has non-empty title and tagline', () => {
		for (const [index, variants] of Object.entries(ENDING_METADATA)) {
			for (const [path, meta] of Object.entries(variants)) {
				expect(meta.title.length, `ruleIndex ${index} path "${path}" has empty title`).toBeGreaterThan(0);
				expect(meta.tagline.length, `ruleIndex ${index} path "${path}" has empty tagline`).toBeGreaterThan(0);
			}
		}
	});
});
