<script lang="ts">
import { goto } from "$app/navigation";

import { basePath, getToken } from "$lib/configuration";

    // Variable if clicking should go to the post
    export let goToPost = false

    // Id of the post
    export let postID = -1

    // Variable for the text content
    export let text = ''

    function loadImage() {

    }

</script>

<div on:click={() => {
    if(goToPost) goto('/app/post/' + postID)
}} class="rendered">        
    {#each text.split('\n') as line}

    {#if line.startsWith('# ')}

    <h2 style="margin-bottom: 3px;">{line.replace('# ', '')}</h2>

    {:else if line.startsWith('@image:')}

    <img src="{basePath}/api/image/download/{line.split(':')[1]}/{getToken()}" alt="Bild konnte nicht geladen werden!">

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

    img {
        width: 100%;
        border-radius: 1em;
    }

</style>