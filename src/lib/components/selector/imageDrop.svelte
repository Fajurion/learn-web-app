<script lang="ts">
import { formOpen, maxFileSize } from "$lib/configuration";
import { showNotification } from "../notificationStore";
import { selectionResult } from "./selectorStore";

    let image: any

    function onInput() {

        if(image[0].size > maxFileSize) {
            showNotification('Du kannst nur Dateien unter 4 Megabyte hochladen!', 'red', 5000)
            image = undefined
            return
        }

        formOpen.set(false)
        selectionResult.set(image[0])

    }

</script>

<div class="panel">

    <input bind:files={image} on:change={onInput} type="file" id="file" accept=".png,.jpeg,.jpg">

    <label for="file">
        <span style="font-size: 50px;" class="material-icons">add_photo_alternate</span>
        <p>PNG/JPEG-Bild</p>
        <p>maximal 4 MB</p>
    </label>

    <p style="margin-top: 1em; color: var(--hidden-text-color);">Falls dein Bild zu groß sein sollte, kannst du versuchen
         es zu einer JPG-Datei umzuwandeln. Der Link unter diesem Text führt dich zu
        CloudConvert, dort kannst du dein Bild kostenlos konvertieren.</p>

    <button style="margin-top: 0.5em;" on:click={() => {
        location.assign('https://cloudconvert.com/png-to-jpg')
    }}>Zu CloudConvert</button>

</div>

<style lang="scss">

    .panel {
        width: calc(100% - 0.2em);
    }

    input {
        display: none;
    }

    label {
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5em;
        flex-direction: column;
        justify-content: center;
        background-color: var(--menu-color);
        border-radius: 1em;
        padding: 2em 0em;
        width: 100%;
    }

    span {
        color: var(--highlight-color);
    }

</style>