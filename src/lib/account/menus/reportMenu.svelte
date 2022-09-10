<script lang="ts">
import { page } from "$app/stores";
import { showNotification } from "$lib/components/notificationStore";
import { formOpen, getToken, postRequest } from "$lib/configuration";

import "$lib/styles/copy.scss";
import { onDestroy, onMount } from "svelte";
let description = ''
let link = ''

let unsub: any

onMount(() => {
    unsub = formOpen.subscribe(() => {
        link = $page.url.href
    })
})

onDestroy(() => unsub())

function send() {
    postRequest("/api/report/create", {
        token: getToken(),
        url: link,
        description: description
    }, (json: any) => {
        if(!json.success) {
            console.log(json.message)
            return
        }

        showNotification("Deine Meldung wurde gesendet!", "green", 2000);
        formOpen.set(false) 
    })
}

</script>

<p class="link"><span class="material-icons">link</span>{link}</p>

<p class="spacer">Bitte beschreibe das Problem mit dem Inhalt: ({description.length} / 200)</p>

<div class="description spacer">
    <textarea bind:value={description} placeholder="Beschreibung" />
</div>

<button on:click={send} class="spacer">Absenden</button>

<style lang="scss">

    .description {
        display: flex;
    }

    .spacer {
        margin-top: 10px;
    }

    textarea {
		overflow: hidden;
        resize: none;
        outline: none;
        border: none;
        line-height: 1.2;
        padding: 0.5em;
        font-size: 18px;
        border-radius: 0.3em;
        height: 4.5em;
        background-color: var(--menu-color);
        width: 100%;
        color: var(--text-color);
	}

    .link {
        display: flex;
        align-items: center;
        padding: 0.6em;
        gap: 0.3em;
        border-radius: 0.3em;
        background-color: var(--menu-color);
        
        span {
            user-select: none;
            color: var(--highlight-color);
        }
    }

</style>