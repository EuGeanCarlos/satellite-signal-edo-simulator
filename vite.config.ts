import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

function resolveBasePath(): string {
  const repository =
    process.env.GITHUB_REPOSITORY;

  const isGitHubActions =
    process.env.GITHUB_ACTIONS === 'true';

  if (
    isGitHubActions &&
    repository
  ) {
    const repositoryName =
      repository.split('/')[1];

    return `/${repositoryName}/`;
  }

  return '/';
}

export default defineConfig({
  plugins: [
    react(),
  ],

  base:
    resolveBasePath(),
});