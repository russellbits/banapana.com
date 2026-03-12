import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import TableOfContents from './TableOfContents.svelte';

const ARTICLES = [
	{ title: 'Second Article', published: '2026-02-12', path: '/2026/02/second-article' },
	{ title: 'First Article', published: '2025-10-01', path: '/2025/10/first-article' },
];

describe('TableOfContents', () => {
	it('renders article titles as links', async () => {
		render(TableOfContents, { articles: ARTICLES, open: true });
		await expect.element(page.getByRole('link', { name: 'Second Article' })).toBeInTheDocument();
		await expect.element(page.getByRole('link', { name: 'First Article' })).toBeInTheDocument();
	});

	it('links point to correct article paths', async () => {
		render(TableOfContents, { articles: ARTICLES, open: true });
		const link = page.getByRole('link', { name: 'Second Article' });
		await expect.element(link).toHaveAttribute('href', '/2026/02/second-article');
	});

	it('renders formatted dates', async () => {
		render(TableOfContents, { articles: ARTICLES, open: true });
		await expect.element(page.getByText('February 12, 2026')).toBeInTheDocument();
		await expect.element(page.getByText('October 1, 2025')).toBeInTheDocument();
	});

	it('renders a close button', async () => {
		render(TableOfContents, { articles: ARTICLES, open: true });
		await expect.element(page.getByRole('button', { name: 'Close table of contents' })).toBeInTheDocument();
	});

	it('does not have the open class when closed', async () => {
		const { container } = render(TableOfContents, { articles: ARTICLES, open: false });
		const sheet = page.elementLocator(container.querySelector('.toc-sheet'));
		await expect.element(sheet).not.toHaveClass('open');
	});
});
