<script lang="ts">
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
</script>

<h2>Form action</h2>
<p>SvelteKit form action (a.k.a. server action). Submitting the form POSTs back to this route.</p>
<p>Toggle the <code>leak</code> checkbox to have the action return <code>SECRET_ITEM</code> in its result.</p>

<form method="POST">
	<label>
		Name:
		<input name="name" />
	</label>
	<label>
		<input type="checkbox" name="leak" />
		Leak secret in action result
	</label>
	<button type="submit">Submit</button>
</form>

<p>GREETING (from loader): {data.GREETING}</p>

{#if form}
	<h3>Action result</h3>
	<ul>
		<li>greeting: {form.greeting}</li>
		{#if 'leakedSecret' in form}
			<li>leakedSecret: {form.leakedSecret}</li>
		{/if}
	</ul>
{/if}
