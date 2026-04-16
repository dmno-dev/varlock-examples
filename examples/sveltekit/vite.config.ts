import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import { sveltekit } from '@sveltejs/kit/vite';
import { varlockVitePlugin } from '@varlock/vite-integration';
import { varlockCloudflareVitePlugin } from '@varlock/cloudflare-integration';
import { ENV } from 'varlock/env';

const useCloudflare = process.env.SVELTE_ADAPTER === 'cloudflare';

console.log('VARLOCK_ENV:', ENV.VARLOCK_ENV, '| adapter:', useCloudflare ? 'cloudflare' : 'auto');

export default defineConfig({
	plugins: [
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(useCloudflare ? varlockCloudflareVitePlugin() : varlockVitePlugin()) as any,
		sveltekit(),
	],
	test: {
		expect: { requireAssertions: true },
		projects: [
			{
				extends: './vite.config.ts',
				test: {
					name: 'client',
					browser: {
						enabled: true,
						provider: playwright(),
						instances: [{ browser: 'chromium', headless: true }]
					},
					include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
					exclude: ['src/lib/server/**']
				}
			},
			{
				extends: './vite.config.ts',
				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
				}
			}
		]
	}
});
