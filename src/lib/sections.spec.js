import { describe, expect, it } from 'vitest';
import { slugRotation } from './sections.js';

describe('slugRotation', () => {
	it('returns a value between -4 and 4 inclusive', () => {
		const result = slugRotation('/2026/03/doomtubers');
		expect(result).toBeGreaterThanOrEqual(-4);
		expect(result).toBeLessThanOrEqual(4);
	});

	it('returns an integer', () => {
		const result = slugRotation('/2026/03/doomtubers');
		expect(Number.isInteger(result)).toBe(true);
	});

	it('returns the same value for the same input (deterministic)', () => {
		const a = slugRotation('/2025/05/notes-on-cognitive-liberty');
		const b = slugRotation('/2025/05/notes-on-cognitive-liberty');
		expect(a).toBe(b);
	});

	it('returns different values for different inputs', () => {
		// Pre-verified: doomtubers → 1, tulips-to-transformers → 4
		const a = slugRotation('/2026/03/doomtubers');
		const b = slugRotation('/2025/10/from-tulips-to-transformers-a-brief-history-of-expensive-mistakes');
		expect(a).not.toBe(b);
	});

	it('handles empty string without throwing', () => {
		expect(() => slugRotation('')).not.toThrow();
	});
});
