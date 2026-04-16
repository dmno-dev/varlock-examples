import adapterAuto from '@sveltejs/adapter-auto';
import adapterCloudflare from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const useCloudflare = process.env.SVELTE_ADAPTER === 'cloudflare';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// Adapter is selected based on SVELTE_ADAPTER env var (set by package.json scripts).
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: useCloudflare ? adapterCloudflare() : adapterAuto()
	}
};

export default config;
