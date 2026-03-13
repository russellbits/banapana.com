import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import SectionTab from './SectionTab.svelte';

describe('SectionTab', () => {
	it('renders the section name', async () => {
		render(SectionTab, { section: 'Mind Control' });
		await expect.element(page.getByText('Mind Control')).toBeInTheDocument();
	});

	it('renders "Dept. of" label', async () => {
		render(SectionTab, { section: 'Fabertising' });
		await expect.element(page.getByText('Dept. of')).toBeInTheDocument();
	});

	it('renders the section SVG icon', async () => {
		render(SectionTab, { section: 'Design Science' });
		const img = page.getByRole('img', { hidden: true });
		await expect.element(img).toHaveAttribute('src', '/symbols/design-science.svg');
	});

	it('renders nothing when section has no svgFile (unknown section)', () => {
		const { container } = render(SectionTab, { section: 'Unknown' });
		// querySelector returns null → no .section-tab element was rendered
		expect(container.querySelector('.section-tab')).toBeNull();
	});

	it('applies the section background color via inline style', async () => {
		const { container } = render(SectionTab, { section: 'Fabertising' });
		const tab = container.querySelector('.section-tab');
		await expect.element(page.elementLocator(tab)).toHaveStyle('background-color: rgb(224, 66, 224)');
	});
});
