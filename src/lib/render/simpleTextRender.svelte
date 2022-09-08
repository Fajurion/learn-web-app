<script lang="ts">

    // Variable for the text content
    export let text = ''

</script>

<div class="rendered">        
    {#each text.split('\n') as line}

    {#if line.startsWith('# ')}
    <h2 style="margin-bottom: 3px;">{line.replace('# ', '')}</h2>

    {:else if line == ''}
    <div style="margin-top: 1em;"></div>
    {:else}
    <p>{line}</p>
    {/if}

    {/each}
</div>

<style lang="scss">

    .rendered {
        width: 100%;
    }

    p {
        word-wrap: break-word;
    }

</style>