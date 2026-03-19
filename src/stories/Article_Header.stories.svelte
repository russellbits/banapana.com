<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ArticleHeader from '$lib/components/Article_Header.svelte';

  const { Story } = defineMeta({
    title: 'Components/ArticleHeader',
    component: ArticleHeader,
    tags: ['autodocs'],
    parameters: { layout: 'padded' }
  });
</script>

<!-- Avatar image at /images/authors/re-warner.png must exist in static/ for this to show -->
<Story name="WithAvatar" args={{ author: 'R.E. Warner', wordCount: 1200, date: '2026-03-19' }} />
<!-- Unknown author → avatar 404s → onerror fires → falls back to /images/default_gravatar.gif -->
<Story name="MissingAvatar" args={{ author: 'Unknown Author', wordCount: 480, date: '2026-01-15' }} />
