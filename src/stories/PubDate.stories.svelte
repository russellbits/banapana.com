<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import PubDate from '$lib/components/PubDate.svelte';

  const { Story } = defineMeta({
    title: 'Components/PubDate',
    component: PubDate,
    tags: ['autodocs'],
    parameters: { layout: 'centered' }
  });
</script>

<Story name="Default" />
