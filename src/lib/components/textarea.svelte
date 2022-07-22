<script>
	export let value = '';
    export let placeholder = ''

    function expand() {
        const txt = document.querySelector('#textarea')
        // @ts-ignore
        txt.style.height = '0px'
        // @ts-ignore
        txt.style.height = txt?.scrollHeight + 'px'
    }
</script>

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