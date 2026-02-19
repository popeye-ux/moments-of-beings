// @ts-check
import { defineConfig } from 'astro/config';
import { rehypeBaseImages } from './src/utils/rehype-base-images';

const base = "/moments-of-beings/";

// https://astro.build/config
export default defineConfig({
    site: "https://popeye-ux.github.io",
    base,
    markdown: {
        rehypePlugins: [[rehypeBaseImages, { base }]],
    },
});
