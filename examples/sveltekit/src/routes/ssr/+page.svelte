<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<h2>SSR loader</h2>
<p>Data returned from a <code>+page.server.ts</code> load function.</p>
<p>
	Add <a href="?leak=1" data-sveltekit-preload-data="off"><code>?leak=1</code></a> to leak
	<code>SECRET_ITEM</code> through the loader's returned data — varlock's server-response leak
	scanner should catch it.
</p>

<ul>
	<li>message: {data.message}</li>
	<li>GREETING: {data.GREETING}</li>
	{#if 'leakedSecret' in data}
		<li>leakedSecret: {data.leakedSecret}</li>
	{/if}
</ul>
