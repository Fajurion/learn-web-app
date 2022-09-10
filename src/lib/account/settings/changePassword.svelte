<script lang="ts">
import { showNotification } from "$lib/components/notificationStore";
import { formOpen, getToken, postRequest } from "$lib/configuration";

import "$lib/styles/input.scss"

let currentPW: string = '', newPW: string = '', newPW2: string = ''

function changePassword() {

    // Check if passwords match
    if(newPW != newPW2) {
        showNotification('Die Passwörter sind nicht gleich!', 'red', 2000)
        return
    }

    // Check if password meats requirements
    if(newPW.length < 10) {
        showNotification('Dein Passwort muss länger als 10 Zeichen sein!', 'red', 2000)
        return
    }

    postRequest('/api/settings/password', {
        token: getToken(),
        currentPassword: currentPW,
        newPassword: newPW
    }, (json: any) => {
        if(!json.success) {

            switch(json.message) {
                case 'invalid.password':
                    showNotification('Dein derzeitiges Passwort ist falsch!', 'red', 2000)
                    break
            }

            return
        }

        showNotification('Dein Passwort wurde geändert!', 'green', 2000)
        formOpen.set(false)
        
    })

}

</script>

<div class="panel">

    <p style="color: var(--hidden-text-color);">Hier kannst du dein Passwort ändern.</p>

    <input bind:value={newPW} placeholder="Neues Passwort" class="darker" type="password">
    <input bind:value={newPW2} placeholder="Neues Passwort wiederholen" class="darker" type="password">
    <input bind:value={currentPW} placeholder="Derzeitiges Passwort" class="darker" type="password">

    <button class="darker" on:click={changePassword}>Speichern</button>

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

    input {
        padding: 0.7em;
        border-radius: 0.6em;
    }

    button {
        max-width: fit-content;
    }
</style>