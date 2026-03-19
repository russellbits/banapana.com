import { describe, expect, it } from 'vitest';
import { countWords } from './content.js';

describe('countWords', () => {
  it('counts words in plain text', () => {
    expect(countWords('one two three')).toBe(3);
  });

  it('strips frontmatter before counting', () => {
    const raw = `---\nTitle: Hello\nAuthor: R. E. Warner\n---\none two three`;
    expect(countWords(raw)).toBe(3);
  });

  it('handles text with extra whitespace and newlines', () => {
    expect(countWords('one  two\nthree\t four')).toBe(4);
  });

  it('returns 0 for empty string', () => {
    expect(countWords('')).toBe(0);
  });

  it('returns 0 for frontmatter-only content', () => {
    const raw = `---\nTitle: Hello\n---\n`;
    expect(countWords(raw)).toBe(0);
  });
});
