import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Sidebar from './Sidebar.svelte';

describe('Sidebar', () => {
	it('renders the title', async () => {
		render(Sidebar, { title: 'Key Concept', content: 'Some text.' });
		await expect.element(page.getByText('Key Concept')).toBeInTheDocument();
	});

	it('renders the content', async () => {
		render(Sidebar, { title: 'My Box', content: 'Here is the content.' });
		await expect.element(page.getByText('Here is the content.')).toBeInTheDocument();
	});

	it('renders the lightbulb icon', async () => {
		render(Sidebar, { title: 'T', content: 'C' });
		const img = page.getByRole('img', { hidden: true });
		await expect.element(img).toHaveAttribute('src', '/symbols/light-bulb.svg');
	});

	it('renders HTML content safely', async () => {
		render(Sidebar, { title: 'T', content: '<strong>Bold</strong> text.' });
		await expect.element(page.getByText('Bold text.')).toBeInTheDocument();
	});

	it('has the sidebar CSS class', async () => {
		const { container } = render(Sidebar, { title: 'T', content: 'C' });
		await expect.element(page.elementLocator(container.querySelector('.sidebar'))).toBeInTheDocument();
	});
});
