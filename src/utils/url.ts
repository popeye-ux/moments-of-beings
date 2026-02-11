/**
 * 部署 base 路徑，deploy 在子路徑時確保連結正確
 * 根網域時為 "/"，子路徑時為 "/moments-of-beings/"
 */
export const base = import.meta.env.BASE_URL ?? '/';

/** 將路徑加上 base（處理前導斜線避免重複） */
export function withBase(path: string): string {
  const p = path.replace(/^\//, '');
  const b = base.endsWith('/') ? base : base + '/';
  return p ? `${b}${p}` : b.replace(/\/$/, '') || '/';
}

/** 圖片等靜態資源：使用完整 URL，避免 GitHub Pages 路徑解析問題 */
export function assetUrl(path: string): string {
  const site = import.meta.env.SITE?.replace(/\/$/, '') ?? '';
  const p = path.replace(/^\//, '');
  const b = base.endsWith('/') ? base : base + '/';
  const fullPath = p ? `${b}${p}` : b.replace(/\/$/, '') || '/';
  return site ? `${site}${fullPath}` : fullPath;
}
