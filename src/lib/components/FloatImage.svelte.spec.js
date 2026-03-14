import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import FloatImage from './FloatImage.svelte';

describe('FloatImage', () => {
	it('renders an img with the correct src', async () => {
		render(FloatImage, { src: './media/cover.jpg', alt: 'A cover image', side: 'right' });
		const img = page.getByRole('img');
		await expect.element(img).toHaveAttribute('src', './media/cover.jpg');
	});

	it('renders an img with the correct alt text', async () => {
		render(FloatImage, { src: './media/cover.jpg', alt: 'A cover image', side: 'right' });
		await expect.element(page.getByRole('img')).toHaveAttribute('alt', 'A cover image');
	});

	it('wraps the image in a figure element', async () => {
		const { container } = render(FloatImage, { src: './media/cover.jpg', alt: 'Test', side: 'right' });
		expect(container.querySelector('figure')).not.toBeNull();
		expect(container.querySelector('figure img')).not.toBeNull();
	});

	it('floats right when side="right"', async () => {
		const { container } = render(FloatImage, { src: './media/cover.jpg', alt: 'Test', side: 'right' });
		const figure = container.querySelector('figure');
		await expect.element(page.elementLocator(figure)).toHaveStyle('float: right');
	});

	it('floats left when side="left"', async () => {
		const { container } = render(FloatImage, { src: './media/cover.jpg', alt: 'Test', side: 'left' });
		const figure = container.querySelector('figure');
		await expect.element(page.elementLocator(figure)).toHaveStyle('float: left');
	});

	it('applies negative right margin when floating right', async () => {
		const { container } = render(FloatImage, { src: './media/cover.jpg', alt: 'Test', side: 'right' });
		const figure = container.querySelector('figure');
		await expect.element(page.elementLocator(figure)).toHaveStyle('margin-right: -0.5rem');
	});

	it('applies negative left margin when floating left', async () => {
		const { container } = render(FloatImage, { src: './media/cover.jpg', alt: 'Test', side: 'left' });
		const figure = container.querySelector('figure');
		await expect.element(page.elementLocator(figure)).toHaveStyle('margin-left: -0.5rem');
	});
});
