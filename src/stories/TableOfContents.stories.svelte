<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import TableOfContents from '$lib/components/TableOfContents.svelte';

  const ARTICLES = [
    { title: 'Doomtubers', published: '2026-03-19', path: '/2026/03/doomtubers' },
    { title: 'The Fluency Illusion', published: '2026-03-17', path: '/2026/03/the-fluency-illusion' },
    { title: 'Notes on Cognitive Liberty', published: '2025-05-25', path: '/2025/05/notes-on-cognitive-liberty' }
  ];

  const { Story } = defineMeta({
    title: 'Components/TableOfContents',
    component: TableOfContents,
    tags: ['autodocs'],
    parameters: { layout: 'fullscreen' }
  });
</script>

<Story name="Closed" args={{ articles: ARTICLES, open: false }} />
<Story name="Open" args={{ articles: ARTICLES, open: true }} />
