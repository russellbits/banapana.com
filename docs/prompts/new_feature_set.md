# New Feature Set

## Section Tabs
I would like each article to be accompanied by a tab on the side of the view below the cover. I have included an image, `/docs/prompts/figure-1.png` which left column shows tabs for sections. See below for identifying sections. Also, in the root level `/static/symbols` directory, there are SVG files for each section. The files are named after the section title, e.g. `fabertising.svg`, `they_re_thinking.svg`, etc.

### Section Styling

In the frontmatter in articles, there is now a `Section` property which should be associated with the following colors:

Section Title | css name | color
Fabertising | fabertising | #E042E0
They're Thinking | they_re_thinking | #5EC035
Mind Control | mind_control | #3AB7F4
Made You Look | made_you_look | #3AB7F4
Design Science | design_science | #EBAF00
Social Butterfly | social_butterfly | #66CCA0
Generic Banapana | banapana_green | #5EC035

## Sidebar component
I would like to create a new component that can appear inline within articles. The component can accept a title and some markdown content. It will get this content from the main markdown file, i.e. article.md. In an article.md file which becomes +page.svx can have content such as:

```
[SIDEBAR]
title: "My Sidebar"
content: "This is the content of my sidebar."
[/SIDEBAR]
```
I have included an image, `/docs/prompts/figure-1.png` that is a chart of the section tabs and sidebar layouts. The sidebar layouts are on the right. I have also provided the `light-bulb.svg` file for includsion in the upper right corner of the sidebars. Each SVG file is named for its corresponding section.

A likely place to create a function for this component is in content.js since that function is extracting frontmatter from +page.svx.



===


Some changes to your plan:
1. There will be a `banapana.svg` file for the generic case.
2. Section tabs, rather than be hidden on mobile, should be square, and centered their content and appear inline after the cover.
Everything else looks good.


===

Everything looks good, but there are some changes.

## Table of Contents 
The TOC is back down to 4 articles when there should be six.

## Interim Build Process
Running `npm run dev` right now does not appear to engage in things like building the TOC. Can we wire that process into the dev server so I can get a preview of the final build?

## Article layout
In the specific case of `/2023/12/le-grande-bibliotheque-and-the-future-with-ai` The frontmatter is showing and there is no Cover component.

The sidebar is present! That's good. However, it shows up filling the whole column width. It is meant to be off to the side.

In all, the article layout should be thought of as a four column layout with a maximum width of 1200px. As the width reduces, the columns should reduce down to mobile size where it should be one column with every element spanning the one column.

Try using
```
display: grid;
grid-template-columns: repeat(auto-fit, minmax(min(100%, 1200px), 1fr));
```

When there are 4 columns, regular body text fills all four columns. A sidebar or image should be 1/2 of # of columns wide but alternating one negative column right or left and pushing out of the article margin to the edge of the page -0.5rem. When the site is reduced to one column, then all elements are inline and the whole width of the column with no negative margins.

The section tab should be rotated randomly between 4 and -4 degrees. 

Please see `article-page-layout-with-grid.png` and `article-page-layout-no-grid.png` image in this directory for more detail on how article layouts should look.