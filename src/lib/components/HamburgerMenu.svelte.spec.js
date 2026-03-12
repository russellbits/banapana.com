import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import HamburgerMenu from './HamburgerMenu.svelte';

describe('HamburgerMenu', () => {
	it('renders a button with aria-label', async () => {
		render(HamburgerMenu, { open: false });
		const btn = page.getByRole('button', { name: 'Toggle table of contents' });
		await expect.element(btn).toBeInTheDocument();
	});

	it('renders three line spans inside the button', async () => {
		render(HamburgerMenu, { open: false });
		const lines = page.getByRole('button').locator('.line');
		await expect.element(lines.nth(0)).toBeInTheDocument();
		await expect.element(lines.nth(1)).toBeInTheDocument();
		await expect.element(lines.nth(2)).toBeInTheDocument();
	});
});
