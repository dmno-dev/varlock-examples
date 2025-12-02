<h1>SvelteKit + Varlock test</h1>
<ul>
  <li>{ENV.FOO_ITEM}</li>
  <!-- <li>{ENV.BAD}</li> -->

  <!-- Will trigger a leak error -->
  <!-- <li>{ENV.SECRET_ITEM}</li> -->
</ul>
<p>{data.message}</p>

<script lang="ts">
	import { onMount } from 'svelte';
  import { ENV } from 'varlock/env';
  import type { PageProps } from './$types';
  
  // test some client-side only errors
  onMount(() => {
    // shows an error about the key not existing
    // console.log(ENV.BAD_KEY);
    
    // should display an error about it not being available (in dev only)
    // console.log(ENV.SECRET_ITEM);
  });

  // will cause a 500 due to bad key
  // console.log(ENV.BADKEY);

  let { data }: PageProps = $props();
</script>
