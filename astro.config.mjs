import { defineConfig } from 'astro/config';

const basePath = (process.env.BASE_PATH || '').replace(/^\/+|\/+$/g, '');

export default defineConfig({
  site: process.env.SITE_URL || undefined,
  base: basePath ? `/${basePath}/` : '/',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
});
