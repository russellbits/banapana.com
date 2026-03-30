import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import SiteMenu from './SiteMenu.svelte';

describe('SiteMenu', () => {
  it('renders a nav element', async () => {
    const { container } = render(SiteMenu);
    const nav = container.querySelector('nav');
    await expect.element(page.elementLocator(nav)).toBeInTheDocument();
  });

  it('renders all five social icon links', async () => {
    const { container } = render(SiteMenu);
    const links = container.querySelectorAll('a');
    expect(links).toHaveLength(5);
  });

  it('renders Substack link with correct href', async () => {
    const { container } = render(SiteMenu);
    const links = container.querySelectorAll('a');
    // Use getAttribute to avoid browser trailing-slash normalization on bare domains
    expect(links[0].getAttribute('href')).toBe('https://banapana.substack.com');
  });

  it('renders Medium link with correct href', async () => {
    const { container } = render(SiteMenu);
    const links = container.querySelectorAll('a');
    expect(links[1].getAttribute('href')).toBe('https://medium.com/minds-on-media');
  });

  it('opens links in new tab with rel noopener', async () => {
    const { container } = render(SiteMenu);
    const links = container.querySelectorAll('a');
    for (const link of links) {
      expect(link.target).toBe('_blank');
      expect(link.rel).toContain('noopener');
    }
  });

  it('renders five icon images', async () => {
    const { container } = render(SiteMenu);
    const imgs = container.querySelectorAll('img');
    expect(imgs).toHaveLength(5);
  });

  it('each icon image has empty alt text', async () => {
    const { container } = render(SiteMenu);
    const imgs = container.querySelectorAll('img');
    for (const img of imgs) {
      expect(img.alt).toBe('');
    }
  });

  it('nav has aria-label Social links', async () => {
    const { container } = render(SiteMenu);
    const nav = container.querySelector('nav');
    expect(nav.getAttribute('aria-label')).toBe('Social links');
  });
});
