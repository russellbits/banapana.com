<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import HamburgerMenu from '$lib/components/HamburgerMenu.svelte';

  const { Story } = defineMeta({
    title: 'Components/HamburgerMenu',
    component: HamburgerMenu,
    tags: ['autodocs'],
    parameters: { layout: 'centered' }
  });
</script>

<Story name="Closed" args={{ open: false }} />
<Story name="Open" args={{ open: true }} />
