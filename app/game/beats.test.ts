import { describe, it, expect } from 'vitest';
import { BEATS, getBeat } from './beats';

describe('BEATS', () => {
	it('contains exactly 5 beats', () => {
		expect(BEATS).toHaveLength(5);
	});

	it('has beats with sequential ids from 0 to 4', () => {
		BEATS.forEach((beat, index) => {
			expect(beat.id).toBe(index);
		});
	});

	it('each beat has a non-empty name', () => {
		BEATS.forEach((beat) => {
			expect(beat.name.length).toBeGreaterThan(0);
		});
	});

	it('each beat has a non-empty description', () => {
		BEATS.forEach((beat) => {
			expect(beat.description.length).toBeGreaterThan(0);
		});
	});

	it('each beat has a keywords array', () => {
		BEATS.forEach((beat) => {
			expect(Array.isArray(beat.keywords)).toBe(true);
		});
	});

	it('first beat is Introduction', () => {
		expect(BEATS[0].name).toBe('Introduction');
	});

	it('last beat is Resolution', () => {
		expect(BEATS[4].name).toBe('Resolution');
	});
});

describe('getBeat', () => {
	it('returns the Introduction beat for id 0', () => {
		expect(getBeat(0).name).toBe('Introduction');
	});

	it('returns the Rising Action beat for id 1', () => {
		expect(getBeat(1).name).toBe('Rising Action');
	});

	it('returns the Resolution beat for id 4', () => {
		expect(getBeat(4).name).toBe('Resolution');
	});

	it('returns a beat whose id matches the requested id', () => {
		for (let i = 0; i < 5; i++) {
			expect(getBeat(i).id).toBe(i);
		}
	});

	it('falls back to the first beat for a negative id', () => {
		expect(getBeat(-1).id).toBe(0);
	});

	it('falls back to the first beat for an out-of-range id', () => {
		expect(getBeat(99).id).toBe(0);
	});
});
