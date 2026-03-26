import { describe, it, expect } from 'vitest';
import { buildSystemPrompt, buildIntroPrompt, buildUserPrompt, dispositionLabel } from './promptBuilder';
import { BEATS } from './beats';
import type { WorldSeed, WorldRules, BeatScene, NpcStateMap } from './types';

const seed: WorldSeed = {
	theme: 'noir detective',
	setting: 'Rain-soaked city, 1940s',
	protagonist: 'A weary private detective with a troubled past',
	hook: 'A mysterious woman walks into your office with a case that\'s bigger than it seems.',
};

const beat = BEATS[0];

describe('buildSystemPrompt', () => {
	it('returns a non-empty string', () => {
		const result = buildSystemPrompt(seed, beat);
		expect(typeof result).toBe('string');
		expect(result.length).toBeGreaterThan(0);
	});

	it('includes the theme', () => {
		const result = buildSystemPrompt(seed, beat);
		expect(result).toContain(seed.theme);
	});

	it('includes the setting', () => {
		const result = buildSystemPrompt(seed, beat);
		expect(result).toContain(seed.setting);
	});

	it('includes the protagonist', () => {
		const result = buildSystemPrompt(seed, beat);
		expect(result).toContain(seed.protagonist);
	});

	it('includes the beat name', () => {
		const result = buildSystemPrompt(seed, beat);
		expect(result).toContain(beat.name);
	});

	it('includes the beat description', () => {
		const result = buildSystemPrompt(seed, beat);
		expect(result).toContain(beat.description);
	});

	it('includes world rules when provided', () => {
		const rules: WorldRules = {
			global: ['No magic allowed'],
			scenes: {},
		};
		const result = buildSystemPrompt(seed, beat, rules);
		expect(result).toContain('No magic allowed');
	});

	it('includes scene items from world rules', () => {
		const scene: BeatScene = {
			items: ['rusty key', 'old map'],
			characters: [],
			exits: ['north', 'south'],
			constraints: [],
			completionConditions: [],
		};
		const rules: WorldRules = { global: [], scenes: { [beat.id]: scene } };
		const result = buildSystemPrompt(seed, beat, rules);
		expect(result).toContain('rusty key');
		expect(result).toContain('old map');
	});

	it('includes available exits from world rules', () => {
		const scene: BeatScene = {
			items: [],
			characters: [],
			exits: ['north door', 'east corridor'],
			constraints: [],
			completionConditions: [],
		};
		const rules: WorldRules = { global: [], scenes: { [beat.id]: scene } };
		const result = buildSystemPrompt(seed, beat, rules);
		expect(result).toContain('north door');
	});

	it('does not include rules section when rules are omitted', () => {
		const result = buildSystemPrompt(seed, beat);
		expect(result).not.toContain('WORLD RULES');
	});
});

describe('buildSystemPrompt with inventory', () => {
	const scene: BeatScene = {
		items: ['rusty key', 'old map', 'lantern'],
		characters: [],
		exits: ['north'],
		constraints: [],
		completionConditions: [],
	};
	const rules: WorldRules = { global: [], scenes: { [beat.id]: scene } };

	it('includes all scene items when inventory is empty', () => {
		const result = buildSystemPrompt(seed, beat, rules, []);
		expect(result).toContain('rusty key');
		expect(result).toContain('old map');
		expect(result).toContain('lantern');
	});

	it('excludes items in inventory from Items present', () => {
		const result = buildSystemPrompt(seed, beat, rules, ['rusty key']);
		expect(result).not.toMatch(/Items present:.*rusty key/);
		expect(result).toContain('old map');
		expect(result).toContain('lantern');
	});

	it('includes the inventory section when player carries items', () => {
		const result = buildSystemPrompt(seed, beat, rules, ['rusty key', 'lantern']);
		expect(result).toContain("Player's inventory");
		expect(result).toContain('rusty key');
		expect(result).toContain('lantern');
	});

	it('does not include inventory section when inventory is empty', () => {
		const result = buildSystemPrompt(seed, beat, rules, []);
		expect(result).not.toContain("Player's inventory");
	});

	it('backward-compatible: no inventory param gives same result as empty array', () => {
		const withEmpty = buildSystemPrompt(seed, beat, rules, []);
		const withoutParam = buildSystemPrompt(seed, beat, rules);
		expect(withEmpty).toBe(withoutParam);
	});

	it('omits Items present line when all scene items are in inventory', () => {
		const result = buildSystemPrompt(seed, beat, rules, ['rusty key', 'old map', 'lantern']);
		expect(result).not.toContain('Items present:');
	});
});

describe('buildIntroPrompt', () => {
	it('returns an object with system and user keys', () => {
		const result = buildIntroPrompt(seed);
		expect(result).toHaveProperty('system');
		expect(result).toHaveProperty('user');
	});

	it('system prompt is a non-empty string', () => {
		const result = buildIntroPrompt(seed);
		expect(typeof result.system).toBe('string');
		expect(result.system.length).toBeGreaterThan(0);
	});

	it('user prompt is a non-empty string', () => {
		const result = buildIntroPrompt(seed);
		expect(typeof result.user).toBe('string');
		expect(result.user.length).toBeGreaterThan(0);
	});

	it('system prompt includes the setting', () => {
		const result = buildIntroPrompt(seed);
		expect(result.system).toContain(seed.setting);
	});

	it('system prompt includes the hook', () => {
		const result = buildIntroPrompt(seed);
		expect(result.system).toContain(seed.hook);
	});

	it('user prompt includes scene items when a scene is provided', () => {
		const scene: BeatScene = {
			items: ['magnifying glass', 'fedora'],
			characters: [],
			exits: [],
			constraints: [],
			completionConditions: [],
		};
		const result = buildIntroPrompt(seed, scene);
		expect(result.user).toContain('magnifying glass');
		expect(result.user).toContain('fedora');
	});

	it('user prompt is "Begin the story." when no scene is provided', () => {
		const result = buildIntroPrompt(seed);
		expect(result.user).toBe('Begin the story.');
	});

	it('user prompt is "Begin the story." when scene has no items', () => {
		const scene: BeatScene = { items: [], characters: [], exits: [], constraints: [], completionConditions: [] };
		const result = buildIntroPrompt(seed, scene);
		expect(result.user).toBe('Begin the story.');
	});
});

describe('dispositionLabel', () => {
	it('returns "hostile" for score -2', () => {
		expect(dispositionLabel(-2)).toBe('hostile');
	});

	it('returns "hostile" for scores below -2', () => {
		expect(dispositionLabel(-3)).toBe('hostile');
	});

	it('returns "wary" for score -1', () => {
		expect(dispositionLabel(-1)).toBe('wary');
	});

	it('returns "neutral" for score 0', () => {
		expect(dispositionLabel(0)).toBe('neutral');
	});

	it('returns "receptive" for score 1', () => {
		expect(dispositionLabel(1)).toBe('receptive');
	});

	it('returns "friendly" for score 2', () => {
		expect(dispositionLabel(2)).toBe('friendly');
	});

	it('returns "friendly" for scores above 2', () => {
		expect(dispositionLabel(3)).toBe('friendly');
	});
});

describe('buildSystemPrompt with npcState', () => {
	const scene: BeatScene = {
		items: [],
		characters: [{ name: 'Mara Voss', personality: 'cold, calculating', knowledgeOf: ['the case'], ignorantOf: [] }],
		exits: [],
		constraints: [],
		completionConditions: [],
	};
	const rules: WorldRules = { global: [], scenes: { [BEATS[0].id]: scene } };

	it('includes no disposition tag when npcState is empty', () => {
		const result = buildSystemPrompt(seed, beat, rules, [], {});
		expect(result).toContain('Mara Voss');
		expect(result).not.toContain('disposition');
	});

	it('includes disposition label when npcState has an entry for the character', () => {
		const npcState: NpcStateMap = { 'Mara Voss': { disposition: 1, interactionCount: 2 } };
		const result = buildSystemPrompt(seed, beat, rules, [], npcState);
		expect(result).toContain('Mara Voss');
		expect(result).toContain('disposition toward player: receptive');
	});

	it('shows hostile disposition for negative score', () => {
		const npcState: NpcStateMap = { 'Mara Voss': { disposition: -2, interactionCount: 1 } };
		const result = buildSystemPrompt(seed, beat, rules, [], npcState);
		expect(result).toContain('disposition toward player: hostile');
	});

	it('shows friendly disposition for max positive score', () => {
		const npcState: NpcStateMap = { 'Mara Voss': { disposition: 2, interactionCount: 3 } };
		const result = buildSystemPrompt(seed, beat, rules, [], npcState);
		expect(result).toContain('disposition toward player: friendly');
	});

	it('backward-compatible: no npcState param gives same result as empty map', () => {
		const withEmpty = buildSystemPrompt(seed, beat, rules, [], {});
		const withoutParam = buildSystemPrompt(seed, beat, rules, []);
		expect(withEmpty).toBe(withoutParam);
	});

	it('does not add disposition tag for NPCs not in npcState', () => {
		const npcState: NpcStateMap = { 'Viktor Crane': { disposition: -1, interactionCount: 1 } };
		const result = buildSystemPrompt(seed, beat, rules, [], npcState);
		expect(result).not.toContain('disposition toward player');
	});
});

describe('buildUserPrompt', () => {
	const intent = { type: 'explore' as const, raw: 'go north' };

	it('includes the player raw input', () => {
		const result = buildUserPrompt({ seed, beat, history: [], intent });
		expect(result).toContain('go north');
	});

	it('includes prior history turns', () => {
		const history = [{ player: 'look around', ai: 'You see a dusty room.' }];
		const result = buildUserPrompt({ seed, beat, history, intent });
		expect(result).toContain('look around');
		expect(result).toContain('You see a dusty room.');
	});

	it('only includes the last 5 history turns', () => {
		const history = Array.from({ length: 10 }, (_, i) => ({
			player: `action ${i}`,
			ai: `response ${i}`,
		}));
		const result = buildUserPrompt({ seed, beat, history, intent });
		expect(result).not.toContain('action 0');
		expect(result).toContain('action 5');
	});

	it('works with empty history', () => {
		const result = buildUserPrompt({ seed, beat, history: [], intent });
		expect(result).toBe('Player: go north');
	});
});
