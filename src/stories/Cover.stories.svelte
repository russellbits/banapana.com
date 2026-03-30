<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Cover from '$lib/components/Cover.svelte';

  const ARTICLES = [
    { title: 'Doomtubers', published: '2026-03-19', path: '/2026/03/doomtubers' },
    { title: 'The Fluency Illusion', published: '2026-03-17', path: '/2026/03/the-fluency-illusion' },
    { title: 'Notes on Cognitive Liberty', published: '2025-05-25', path: '/2025/05/notes-on-cognitive-liberty' }
  ];

  const { Story } = defineMeta({
    title: 'Components/Cover',
    component: Cover,
    tags: ['autodocs'],
    parameters: { layout: 'fullscreen' }
  });
</script>

<Story
  name="Default"
  args={{
    title: 'Doomtubers',
    cover_img_url: 'https://picsum.photos/seed/banapana/1600/900',
    articles: ARTICLES
  }}
/>

<Story
  name="Home (no logo link)"
  args={{
    title: 'Doomtubers',
    cover_img_url: 'https://picsum.photos/seed/banapana/1600/900',
    articles: ARTICLES,
    isHome: true
  }}
/>

<Story
  name="With Column Badge"
  args={{
    title: 'Doomtubers',
    cover_img_url: 'https://picsum.photos/seed/banapana/1600/900',
    articles: ARTICLES,
    column: 'Scamtube'
  }}
/>

<Story
  name="With AI Diaspora Badge"
  args={{
    title: 'The Fluency Illusion',
    cover_img_url: 'https://picsum.photos/seed/fluency/1600/900',
    articles: ARTICLES,
    column: 'The AI Diaspora'
  }}
/>
