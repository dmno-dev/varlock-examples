<script lang="ts">
	import { ENV } from 'varlock/env';
	import { browser } from '$app/environment';
</script>

<h2>Home</h2>
<p>
	Comparison of the ways to read env vars in a SvelteKit/Vite app. Rendered {browser
		? 'on the client'
		: 'on the server'}.
</p>
<p>
	Cells marked ❌ would cause a build error if uncommented in the source — hover the source to see
	the commented-out line.
</p>

<h3>varlock vs native JS globals</h3>
<table>
	<thead>
		<tr>
			<th>item</th>
			<th><code>ENV</code> (varlock)</th>
			<th><code>process.env</code></th>
			<th><code>import.meta.env</code></th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><code>GREETING</code></td>
			<td>{ENV.GREETING}</td>
			<td>{typeof process !== 'undefined' ? process.env.GREETING : '—'}</td>
			<td>{import.meta.env.GREETING}</td>
		</tr>
		<tr>
			<td><code>VITE_PREFIXED_ITEM</code></td>
			<td>{ENV.VITE_PREFIXED_ITEM}</td>
			<td>{typeof process !== 'undefined' ? process.env.VITE_PREFIXED_ITEM : '—'}</td>
			<td>{import.meta.env.VITE_PREFIXED_ITEM}</td>
		</tr>
		<tr>
			<td><code>SECRET_ITEM</code> (sensitive)</td>
			<td>
				✅ varlock detects leak
				<!-- {ENV.SECRET_ITEM} -->
			</td>
			<td>
				<i>❌ would leak without varlock</i>
				<!-- {typeof process !== 'undefined' ? process.env.SECRET_ITEM : '—'} -->
			</td>
			<td>
				<i>🚨 silently returns undefined</i>
				{import.meta.env.SECRET_ITEM}
			</td>
		</tr>
		<tr>
			<td><code>BAD_VAR</code> (not in schema)</td>
			<td>
				✅ varlock triggers an error
				<!-- {ENV.BAD_VAR} -->
			</td>
			<td>
				<i>🚨 Silently returns undefined</i>
				{typeof process !== 'undefined' ? process.env.BAD_VAR : ''}
			</td>
			<td>
				<i>🚨 Silently returns undefined</i>
				{import.meta.env.BAD_VAR}
			</td>
		</tr>
	</tbody>
</table>

<style>
	table {
		border-collapse: collapse;
		margin-bottom: 1rem;
	}
	th,
	td {
		padding: 0.4rem 0.8rem;
		border: 1px solid #ccc;
		text-align: left;
	}
</style>
