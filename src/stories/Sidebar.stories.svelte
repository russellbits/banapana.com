<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Sidebar from '$lib/components/Sidebar.svelte';

  const { Story } = defineMeta({
    title: 'Components/Sidebar',
    component: Sidebar,
    tags: ['autodocs'],
    parameters: { layout: 'padded' }
  });
</script>

<Story
  name="Right"
  args={{
    title: 'What Makes a Real Model?',
    content: 'A model has formal structure—parameters, math, and a mechanism that generates specific predictions you can be wrong about in advance. Visualization without falsifiability is storytelling.',
    side: 'right'
  }}
/>
<Story
  name="Left"
  args={{
    title: 'What Makes a Real Model?',
    content: 'A model has formal structure—parameters, math, and a mechanism that generates specific predictions you can be wrong about in advance. Visualization without falsifiability is storytelling.',
    side: 'left'
  }}
/>
