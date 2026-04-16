<script lang="ts">
	let src = $state('/api/data');
</script>

<h2>API route</h2>
<p>
	The iframe below loads <a href={src} target="_blank" data-sveltekit-preload-data="off"
		><code>{src}</code></a
	>. Use the buttons to switch between the clean and leaking versions.
</p>

<div class="buttons">
	<button onclick={() => (src = '/api/data')}>Load clean</button>
	<button onclick={() => (src = '/api/data?leak=1')}>Load leaked</button>
</div>

<iframe title="api response" {src}></iframe>

<style>
	.buttons {
		display: flex;
		gap: 0.5rem;
	}
	iframe {
		display: block;
		width: 100%;
		min-height: 200px;
		margin-top: 1rem;
		border: 1px solid #ccc;
	}
</style>
