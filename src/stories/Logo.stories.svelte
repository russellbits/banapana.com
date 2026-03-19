<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Logo from '$lib/components/Logo.svelte';

  const { Story } = defineMeta({
    title: 'Components/Logo',
    component: Logo,
    tags: ['autodocs'],
    parameters: { layout: 'centered' }
  });
</script>

<Story name="Default" />
