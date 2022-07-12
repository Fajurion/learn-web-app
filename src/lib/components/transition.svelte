<script>
    import { fly } from 'svelte/transition';
    export let url = '';
  </script>
  
  {#key url}
  <div
      in:fly="{{ duration: 250, delay: 300 }}"
      out:fly="{{duration: 250, delay: 1}}" >
      <slot/>
    </div>
  {/key}