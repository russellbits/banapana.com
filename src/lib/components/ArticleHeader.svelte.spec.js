import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import ArticleHeader from './ArticleHeader.svelte';

const defaults = {
  author: 'R. E. Warner',
  wordCount: 480,
  date: '2026-03-19'
};

describe('ArticleHeader', () => {
  it('renders the author name', async () => {
    render(ArticleHeader, defaults);
    await expect.element(page.getByText('R. E. Warner')).toBeInTheDocument();
  });

  it('renders the author avatar with slugified src', async () => {
    const { container } = render(ArticleHeader, defaults);
    const img = container.querySelector('img.avatar');
    await expect.element(page.elementLocator(img)).toHaveAttribute(
      'src',
      '/images/authors/r-e-warner.png'
    );
  });

  it('slugifies dots to hyphens (R.E. Warner → r-e-warner)', async () => {
    const { container } = render(ArticleHeader, { ...defaults, author: 'R.E. Warner' });
    const img = container.querySelector('img.avatar');
    await expect.element(page.elementLocator(img)).toHaveAttribute(
      'src',
      '/images/authors/r-e-warner.png'
    );
  });

  it('renders the read time based on wordCount', async () => {
    render(ArticleHeader, defaults);
    // 480 words / 240 wpm = 2 min read
    await expect.element(page.getByText('⏱ 2 min read')).toBeInTheDocument();
  });

  it('rounds read time up (Math.ceil)', async () => {
    render(ArticleHeader, { ...defaults, wordCount: 241 });
    // 241/240 = 1.004 → ceil → 2
    await expect.element(page.getByText('⏱ 2 min read')).toBeInTheDocument();
  });

  it('renders the formatted date', async () => {
    render(ArticleHeader, defaults);
    // 2026-03-19 → Mar 19, 2026
    await expect.element(page.getByText('Mar 19, 2026')).toBeInTheDocument();
  });

  it.skip('renders the action emoji row', async () => {
    const { container } = render(ArticleHeader, defaults);
    const row2 = container.querySelector('.actions');
    await expect.element(page.elementLocator(row2)).toBeInTheDocument();
    await expect.element(page.elementLocator(row2)).toHaveTextContent('👏');
    await expect.element(page.elementLocator(row2)).toHaveTextContent('🔖');
    await expect.element(page.elementLocator(row2)).toHaveTextContent('🔗');
  });

  it('falls back to default gravatar on avatar error', async () => {
    const { container } = render(ArticleHeader, defaults);
    const img = container.querySelector('img.avatar');
    img.dispatchEvent(new Event('error'));
    await expect.element(page.elementLocator(img)).toHaveAttribute(
      'src',
      '/images/default_gravatar.gif'
    );
  });
});
