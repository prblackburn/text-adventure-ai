import { describe, it, expect } from 'vitest';
import { buildSystemPrompt, buildIntroPrompt, buildUserPrompt } from './promptBuilder';
import { BEATS } from './beats';
import type { WorldSeed, WorldRules, BeatScene } from './types';

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
