import type { NextConfig } from 'next';
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1];
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? (process.env.GITHUB_ACTIONS && repo ? `/${repo}` : '');
const config: NextConfig = { output: 'export', basePath, assetPrefix: basePath, images: { unoptimized: true }, trailingSlash: true };
export default config;
