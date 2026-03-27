import { describe, it, expect } from 'vitest';
import { findWeaponInInventory, resolveCombat, WEAPON_KEYWORDS } from './combat';
import type { BeatScene } from './types';

const emptyScene: BeatScene = { items: [], characters: [], exits: [], constraints: [], completionConditions: [] };
const armedScene: BeatScene = { ...emptyScene, constraints: ['The suspect is armed'] };
const nonArmedScene: BeatScene = { ...emptyScene, constraints: ['The room is dark'] };

describe('WEAPON_KEYWORDS', () => {
	it('contains expected weapon terms', () => {
		expect(WEAPON_KEYWORDS).toContain('revolver');
		expect(WEAPON_KEYWORDS).toContain('knife');
		expect(WEAPON_KEYWORDS).toContain('sword');
	});
});

describe('findWeaponInInventory', () => {
	it('returns undefined for empty inventory', () => {
		expect(findWeaponInInventory([])).toBeUndefined();
	});

	it('returns undefined when no weapons are present', () => {
		expect(findWeaponInInventory(['bottle of whiskey', 'battered case file', 'desk lamp'])).toBeUndefined();
	});

	it('finds a revolver by name', () => {
		expect(findWeaponInInventory(['loaded revolver'])).toBe('loaded revolver');
	});

	it('finds a knife by partial match', () => {
		expect(findWeaponInInventory(['pocket knife'])).toBe('pocket knife');
	});

	it('is case-insensitive', () => {
		expect(findWeaponInInventory(['Iron Sword'])).toBe('Iron Sword');
	});

	it('returns the first weapon found when multiple weapons are present', () => {
		const result = findWeaponInInventory(['crude map', 'loaded revolver', 'dagger']);
		expect(result).toBe('loaded revolver');
	});

	it('returns undefined for items that look similar to weapon keywords but are not weapons', () => {
		// "bladder" does not include "blade" as a substring (different characters), so no false positive
		expect(findWeaponInInventory(['water bladder'])).toBeUndefined();
	});
});

describe('resolveCombat', () => {
	describe('with weapon in inventory', () => {
		it('succeeds against an armed NPC', () => {
			const result = resolveCombat(['loaded revolver'], armedScene, 0);
			expect(result.success).toBe(true);
			expect(result.hasWeapon).toBe(true);
			expect(result.weaponUsed).toBe('loaded revolver');
		});

		it('succeeds against a non-armed NPC', () => {
			const result = resolveCombat(['iron sword'], nonArmedScene, 0);
			expect(result.success).toBe(true);
			expect(result.hasWeapon).toBe(true);
			expect(result.weaponUsed).toBe('iron sword');
		});

		it('succeeds even when NPC disposition is fully hostile', () => {
			const result = resolveCombat(['loaded revolver'], armedScene, -2);
			expect(result.success).toBe(true);
		});
	});

	describe('without weapon in inventory', () => {
		it('fails against an armed NPC', () => {
			const result = resolveCombat(['battered case file'], armedScene, 0);
			expect(result.success).toBe(false);
			expect(result.hasWeapon).toBe(false);
			expect(result.weaponUsed).toBeUndefined();
		});

		it('fails against a fully hostile NPC (disposition -2) even if NPC is unarmed', () => {
			const result = resolveCombat([], nonArmedScene, -2);
			expect(result.success).toBe(false);
		});

		it('succeeds via bravado against a non-armed neutral NPC', () => {
			const result = resolveCombat([], nonArmedScene, 0);
			expect(result.success).toBe(true);
			expect(result.hasWeapon).toBe(false);
		});

		it('succeeds via bravado against a non-armed wary NPC (disposition -1)', () => {
			const result = resolveCombat([], nonArmedScene, -1);
			expect(result.success).toBe(true);
		});

		it('succeeds via bravado against a non-armed friendly NPC (disposition 2)', () => {
			const result = resolveCombat([], nonArmedScene, 2);
			expect(result.success).toBe(true);
		});

		it('fails with empty inventory against armed NPC regardless of disposition', () => {
			expect(resolveCombat([], armedScene, 2).success).toBe(false);
			expect(resolveCombat([], armedScene, 0).success).toBe(false);
			expect(resolveCombat([], armedScene, -1).success).toBe(false);
		});
	});

	describe('edge cases', () => {
		it('handles empty scene (no constraints) — falls back to disposition check', () => {
			const result = resolveCombat([], emptyScene, 0);
			expect(result.success).toBe(true); // no weapon, not armed, neutral → success
		});

		it('armed detection is case-insensitive in constraints', () => {
			const mixedCase: BeatScene = { ...emptyScene, constraints: ['Viktor is Armed and dangerous'] };
			const result = resolveCombat([], mixedCase, 0);
			expect(result.success).toBe(false);
		});
	});
});
