<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>SvelteKit + Varlock</title>
</svelte:head>

<header>
	<h1>SvelteKit + Varlock</h1>
	<nav>
		<a href="/">Home</a>
		<a href="/ssr">SSR loader</a>
		<a href="/client">Client only</a>
		<a href="/form">Form action</a>
		<a href="/api">API route</a>
	</nav>
	<hr />
</header>

{@render children()}

<style>
	header {
		font-family: system-ui, sans-serif;
	}
	nav {
		display: flex;
		gap: 1rem;
	}
	nav a {
		text-decoration: none;
	}
	nav a:hover {
		text-decoration: underline;
	}
</style>
