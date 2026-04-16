<script lang="ts">
	import { onMount } from 'svelte';
	import { ENV } from 'varlock/env';

	onMount(() => {
		// non-sensitive values are inlined at build time and available on the client
		console.log('client - GREETING:', ENV.GREETING);

		// uncommenting either of these should surface a build error
		// console.log('client - SECRET_ITEM:', ENV.SECRET_ITEM);
		// console.log('client - BAD_KEY:', ENV.BAD_KEY);
	});
</script>

<h2>Client only</h2>
<p>This page has no server loader — all env usage happens in <code>onMount</code> on the client.</p>
<ul>
	<li>GREETING: {ENV.GREETING}</li>
</ul>
