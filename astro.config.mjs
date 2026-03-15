import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://youxufkhan.github.io/my-opencode-config',
  srcDir: './docs',
  integrations: [
    starlight({
      title: 'my-opencode-config',
      social: [
        {
          label: 'GitHub',
          href: 'https://github.com/youxufkhan/my-opencode-config',
          icon: 'github',
        },
      ],
      customCss: [
        './docs/custom.css',
      ],
      sidebar: [
        {
          label: 'Getting Started',
          items: [
            { label: 'Quick Start', link: '/guides/getting-started/' },
          ],
        },
        {
          label: 'Reference',
          items: [
            { label: 'Features', link: '/reference/features/' },
            { label: 'Architecture', link: '/reference/architecture/' },
            { label: 'Contributing', link: '/reference/contributing/' },
          ],
        },
      ],
    }),
  ],
  outDir: './docs/dist',
});
