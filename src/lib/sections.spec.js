import { describe, it, expect } from 'vitest';
import { getSection, SECTIONS, DEFAULT_SECTION } from './sections.js';

describe('getSection', () => {
  it('returns correct color for Fabertising', () => {
    const s = getSection('Fabertising');
    expect(s.color).toBe('#E042E0');
    expect(s.svgFile).toBe('fabertising');
    expect(s.cssName).toBe('fabertising');
  });

  it("returns correct color for They're Thinking", () => {
    const s = getSection("They're Thinking");
    expect(s.color).toBe('#5EC035');
    expect(s.svgFile).toBe('they-re-thinking');
  });

  it('returns correct color for Mind Control', () => {
    expect(getSection('Mind Control').color).toBe('#3AB7F4');
    expect(getSection('Mind Control').svgFile).toBe('mind-control');
  });

  it('returns correct color for Made You Look', () => {
    expect(getSection('Made You Look').color).toBe('#3AB7F4');
    expect(getSection('Made You Look').svgFile).toBe('made-you-look');
  });

  it('returns correct color for Design Science', () => {
    expect(getSection('Design Science').color).toBe('#EBAF00');
    expect(getSection('Design Science').svgFile).toBe('design-science');
  });

  it('returns correct color for Social Butterfly', () => {
    expect(getSection('Social Butterfly').color).toBe('#66CCA0');
    expect(getSection('Social Butterfly').svgFile).toBe('social-butterfly');
  });

  it('returns DEFAULT_SECTION for unknown section names', () => {
    const s = getSection('Unknown Section');
    expect(s).toEqual(DEFAULT_SECTION);
    expect(s.color).toBe('#5EC035');
    expect(s.svgFile).toBeNull();
  });

  it('returns DEFAULT_SECTION for empty string', () => {
    expect(getSection('')).toEqual(DEFAULT_SECTION);
  });

  it('returns correct data for Generic Banapana', () => {
    const s = getSection('Generic Banapana');
    expect(s.color).toBe('#5EC035');
    expect(s.svgFile).toBe('banapana');
    expect(s.cssName).toBe('banapana_green');
  });
});
