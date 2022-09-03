<script lang="ts">
import { showNotification } from "$lib/components/notificationStore";
import "$lib/styles/copy.scss"
import "$lib/styles/components.scss"
import "$lib/styles/align.scss"
import { basePath, getToken, postRequest, requesting } from "$lib/configuration";
import { slide } from "svelte/transition";

let qrCode = false, creating = false
let invite = ''

    function getInvite() {
        creating = true
        postRequest('/api/invite/create', {
            token: getToken()
        }, (json: any) => {
            if(!json.success) {
                showNotification('Du hast dafür keine Berechtigung!', 'green', 2000)
                return
            }

            invite = json.data
        })
    }

</script>

<div class="panel">

    {#if !creating}
    <p>Hier kannst du eine Einladung erstellen, um zum Beispiel Freunde einzuladen.</p>
    <button on:click={getInvite}>Einladung erstellen</button>
    {/if}

    {#if $requesting}
    <div class="cc">
        <span class="material-icons loading" style="font-size: 75px;">hourglass_empty</span>
    </div>
    {/if}

    {#if invite}

    <p>Benutze diese Lizenz, um dich zu registrieren:</p>

    <div class="copy">{invite}

    <div class="row">
        <span on:click={() => {
            qrCode = true
        }} class="material-icons">qr_code_scanner</span>

        <span on:click={() => {
            navigator.clipboard.writeText(invite)
            showNotification("Lizenz kopiert!", "green", 2000)
        }} class="material-icons">content_copy</span>
    </div>
    
    </div>
    {/if}

    {#if qrCode}
    <img in:slide style="{(localStorage.getItem("theme") || 'dark') === 'dark' ? 'filter: invert(100%);' : ''}" 
    src={basePath + "/api/invite/image?code=" + invite} alt="Wird geladen.." />
    {/if}
</div>

<style lang="scss">
    .panel {
        padding: 1em;
        display: flex;
        flex-direction: column;
        gap: 0.5em;
        border-radius: 1em;
        background-color: var(--menu-color);
    }

    button {
        background-color: var(--box-color);
        width: max-content;
        border-radius: 0.5em;

        &:hover {
            background-color: var(--hover-color);
        }
    }

    img {
        border-radius: 1em;
    }
</style>