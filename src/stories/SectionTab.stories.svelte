<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import SectionTab from '$lib/components/SectionTab.svelte';

  const { Story } = defineMeta({
    title: 'Components/SectionTab',
    component: SectionTab,
    tags: ['autodocs'],
    parameters: { layout: 'centered' }
  });
</script>

<Story name="Fabertising" args={{ section: 'Fabertising', rotation: 0 }} />
<Story name="TheyreThinking" args={{ section: "They're Thinking", rotation: 0 }} />
<Story name="MindControl" args={{ section: 'Mind Control', rotation: 0 }} />
<Story name="MadeYouLook" args={{ section: 'Made You Look', rotation: 0 }} />
<Story name="DesignScience" args={{ section: 'Design Science', rotation: 0 }} />
<Story name="SocialButterfly" args={{ section: 'Social Butterfly', rotation: 0 }} />
<Story name="GenericBanapana" args={{ section: 'Generic Banapana', rotation: 0 }} />
