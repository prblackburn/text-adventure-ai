import { describe, it, expect } from 'vitest';
import { classifyIntent } from './classifier';

describe('classifyIntent', () => {
	it('preserves raw input on the returned intent', () => {
		const result = classifyIntent('look around');
		expect(result.raw).toBe('look around');
	});

	describe('explore', () => {
		it.each(['go north', 'walk forward', 'move left', 'explore the room', 'travel east', 'head south', 'navigate the corridor', 'run away'])(
			'classifies "%s" as explore',
			(input) => {
				expect(classifyIntent(input).type).toBe('explore');
			},
		);
	});

	describe('examine', () => {
		it.each(['look around', 'examine the door', 'inspect the box', 'check the window', 'read the sign', 'search the room', 'study the map'])(
			'classifies "%s" as examine',
			(input) => {
				expect(classifyIntent(input).type).toBe('examine');
			},
		);
	});

	describe('pick_up', () => {
		it.each(['take the key', 'grab the rope', 'pick up the coin', 'get the lantern', 'collect the herbs'])(
			'classifies "%s" as pick_up',
			(input) => {
				expect(classifyIntent(input).type).toBe('pick_up');
			},
		);
	});

	describe('drop', () => {
		it.each(['drop the torch', 'leave the coin', 'discard the note', 'put down the sword'])(
			'classifies "%s" as drop',
			(input) => {
				expect(classifyIntent(input).type).toBe('drop');
			},
		);
	});

	describe('interact', () => {
		it.each(['push the button', 'pull the lever', 'open the chest', 'close the door', 'touch the crystal'])(
			'classifies "%s" as interact',
			(input) => {
				expect(classifyIntent(input).type).toBe('interact');
			},
		);
	});

	describe('combat', () => {
		it.each(['attack the guard', 'fight the monster', 'hit the enemy', 'strike the goblin', 'shoot the target', 'kill the beast', 'stab the vampire', 'slash the orc'])(
			'classifies "%s" as combat',
			(input) => {
				expect(classifyIntent(input).type).toBe('combat');
			},
		);

		it.each(['insult Dr. Osei', 'threaten Mara Voss', 'taunt the guard', 'mock Viktor Crane', 'intimidate the warden'])(
			'classifies hostile verbal action "%s" as combat',
			(input) => {
				expect(classifyIntent(input).type).toBe('combat');
			},
		);

		it('extracts NPC name as subject from hostile verbal actions', () => {
			expect(classifyIntent('insult Dr. Osei').subject).toBe('Dr. Osei');
			expect(classifyIntent('threaten Mara Voss').subject).toBe('Mara Voss');
			expect(classifyIntent('taunt the guard').subject).toBe('the guard');
		});
	});

	describe('dialogue', () => {
		it.each(['talk to the wizard', 'say hello', 'ask about the map', 'tell him the truth', 'speak to the guard', 'shout for help', 'whisper a secret', 'greet the stranger'])(
			'classifies "%s" as dialogue',
			(input) => {
				expect(classifyIntent(input).type).toBe('dialogue');
			},
		);
	});

	describe('use', () => {
		it.each(['use the key', 'activate the device', 'equip the sword', 'wear the cloak', 'drink the potion', 'eat the bread', 'apply the ointment'])(
			'classifies "%s" as use',
			(input) => {
				expect(classifyIntent(input).type).toBe('use');
			},
		);
	});

	describe('other', () => {
		it('classifies unrecognised input as other', () => {
			expect(classifyIntent('xyzzy').type).toBe('other');
		});

		it('classifies empty string as other', () => {
			expect(classifyIntent('').type).toBe('other');
		});

		it('classifies whitespace-only input as other', () => {
			expect(classifyIntent('   ').type).toBe('other');
		});
	});

	describe('case insensitivity', () => {
		it('classifies uppercase input correctly', () => {
			expect(classifyIntent('LOOK AROUND').type).toBe('examine');
		});

		it('classifies mixed-case input correctly', () => {
			expect(classifyIntent('Go North').type).toBe('explore');
		});
	});

	describe('subject extraction', () => {
		it('extracts subject after keyword', () => {
			expect(classifyIntent('examine the old desk').subject).toBe('the old desk');
		});

		it('extracts multi-word subject', () => {
			expect(classifyIntent('look at the bottle of whiskey').subject).toBe('at the bottle of whiskey');
		});

		it('extracts subject from dialogue intent', () => {
			expect(classifyIntent('talk to Mara').subject).toBe('to Mara');
		});

		it('extracts subject from pick_up intent', () => {
			expect(classifyIntent('take the lantern').subject).toBe('the lantern');
			expect(classifyIntent('take the lantern').type).toBe('pick_up');
		});

		it('extracts subject from explore intent', () => {
			expect(classifyIntent('go north').subject).toBe('north');
		});

		it('preserves original casing in subject', () => {
			expect(classifyIntent('Examine The Old Desk').subject).toBe('The Old Desk');
		});

		it('returns undefined subject when keyword has no argument', () => {
			expect(classifyIntent('explore').subject).toBeUndefined();
		});

		it('returns undefined subject for unrecognised input', () => {
			expect(classifyIntent('xyzzy').subject).toBeUndefined();
		});
	});
});
