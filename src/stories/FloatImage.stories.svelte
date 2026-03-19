<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import FloatImage from '$lib/components/FloatImage.svelte';

  const { Story } = defineMeta({
    title: 'Components/FloatImage',
    component: FloatImage,
    tags: ['autodocs'],
    parameters: { layout: 'padded' }
  });
</script>

<Story
  name="Right"
  args={{
    src: 'https://picsum.photos/seed/floatright/400/300',
    alt: 'Sample image floating right',
    side: 'right'
  }}
/>
<Story
  name="Left"
  args={{
    src: 'https://picsum.photos/seed/floatleft/400/300',
    alt: 'Sample image floating left',
    side: 'left'
  }}
/>
