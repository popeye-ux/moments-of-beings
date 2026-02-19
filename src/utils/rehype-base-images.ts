import { visit } from 'unist-util-visit';
import type { Root, Element } from 'hast';

interface Options {
  base: string;
}

export function rehypeBaseImages(options: Options) {
  const base = options.base.endsWith('/') ? options.base : options.base + '/';
  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      if (node.tagName === 'img' && node.properties?.src) {
        const src = String(node.properties.src);
        if (src.startsWith('/') && !src.startsWith(base)) {
          node.properties.src = base + src.slice(1);
        }
      }
    });
  };
}
