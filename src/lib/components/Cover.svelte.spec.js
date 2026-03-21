import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Cover from './Cover.svelte';

describe('Cover — PubDate positioning', () => {
  it('pubdate-wrapper is a direct child of cover-wrapper, not cover', async () => {
    const { container } = render(Cover, { title: 'Test', cover_img_url: '', articles: [], column: '', isHome: false });
    const coverWrapper = container.querySelector('.cover-wrapper');
    const cover = container.querySelector('.cover');
    const pubdateInWrapper = coverWrapper.querySelector(':scope > .pubdate-wrapper');
    const pubdateInCover = cover.querySelector(':scope > .pubdate-wrapper');
    expect(pubdateInWrapper).not.toBeNull();
    expect(pubdateInCover).toBeNull();
  });
});
