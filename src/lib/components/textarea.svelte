<script>
import { onMount } from "svelte";

    // Id of the area
    export let id = 'textarea'

    // Variable for the text of the textarea
	export let value = '';

    // Variable for the placeholder of the textarea
    export let placeholder = ''

    // Variable for blocking the field
    export let blocked = false

    // Expand on startup
    onMount(() => {
        setTimeout(() => {
            expand()            
        }, 300);
    })

    // Expand textarea on every input
    function expand() {

        // Get textarea
        const txt = document.querySelector('#' + id)

        // Set height to the height of the text
        // @ts-ignore
        txt.style.height = '0px'
        // @ts-ignore
        txt.style.height = txt?.scrollHeight + "px"
    }
</script>

<!-- Text area -->
<textarea class="{blocked ? 'blocked' : ''}" id="{id}" placeholder={placeholder} on:input={expand} bind:value />

<style>
	
	textarea {
        resize: none;
        outline: none;
        border: none;
        line-height: 1.2;
        padding: 0.5em;
        font-size: 18px;
        border-radius: 0.3em;
        background-color: var(--menu-color);
        border: 2px solid var(--menu-color);
        color: var(--text-color);
        transition: border 250ms ease;
    }

    .blocked {
        border: 2px solid red;
    }
	
</style>