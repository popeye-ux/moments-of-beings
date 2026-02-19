/**
 * Remark 插件：將 markdown 內圖片路徑加上 base，解決 deploy 子路徑時破圖
 */
import { visit } from 'unist-util-visit';
import type { Image } from 'mdast';

const base = import.meta.env.BASE_URL ?? '/';
const basePath = base.endsWith('/') ? base : base + '/';

export function remarkBaseImages() {
  return (tree: import('mdast').Root) => {
    visit(tree, 'image', (node: Image) => {
      const url = node.url;
      if (url.startsWith('/') && !url.startsWith(basePath)) {
        node.url = basePath + url.slice(1);
      }
    });
  };
}
