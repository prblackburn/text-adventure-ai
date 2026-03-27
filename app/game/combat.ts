import type { BeatScene } from './types';

export const WEAPON_KEYWORDS = ['revolver', 'gun', 'pistol', 'knife', 'dagger', 'sword', 'blade', 'axe', 'crowbar', 'staff', 'rifle'];

export interface CombatOutcome {
	success: boolean;
	hasWeapon: boolean;
	weaponUsed?: string;
}

export function findWeaponInInventory(inventory: string[]): string | undefined {
	return inventory.find((item) => WEAPON_KEYWORDS.some((w) => item.toLowerCase().includes(w)));
}

/**
 * Determines whether a combat attempt succeeds before the LLM is called.
 *
 * Success rules (in priority order):
 * 1. Player has a weapon in inventory → always succeeds.
 * 2. No weapon + scene constraint mentions "armed" (the NPC is armed) → fails.
 * 3. No weapon + NPC disposition is -2 (fully hostile, fighting back hard) → fails.
 * 4. Otherwise (unarmed vs non-armed or non-max-hostile NPC) → succeeds via bravado/surprise.
 */
export function resolveCombat(inventory: string[], scene: BeatScene, npcDisposition: number): CombatOutcome {
	const weaponUsed = findWeaponInInventory(inventory);
	const hasWeapon = !!weaponUsed;
	const npcArmed = scene.constraints.some((c) => c.toLowerCase().includes('armed'));
	const success = hasWeapon || (!npcArmed && npcDisposition > -2);
	return { success, hasWeapon, weaponUsed };
}
