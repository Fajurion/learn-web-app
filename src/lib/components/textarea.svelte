<script>
import { onMount } from "svelte";

    // Variable for the text of the textarea
	export let value = '';

    // Variable for the placeholder of the textarea
    export let placeholder = ''

    // Expand on startup
    onMount(() => {
        expand()
    })

    // Expand textarea on every input
    function expand() {

        // Get textarea
        const txt = document.querySelector('#textarea')

        // Set height to the height of the text
        // @ts-ignore
        txt.style.height = '0px'
        // @ts-ignore
        txt.style.height = txt?.scrollHeight + 'px'
    }
</script>

<!-- Text area -->
<textarea id="textarea" placeholder={placeholder} on:input={expand} bind:value />

<style>
	
	textarea {
		overflow: hidden;
        resize: none;
        outline: none;
        border: none;
        line-height: 1.2;
        padding: 0.5em;
        font-size: 18px;
        border-radius: 0.3em;
        background-color: var(--menu-color);
        color: var(--text-color);
	}
	
</style>