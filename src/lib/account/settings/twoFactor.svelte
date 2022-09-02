<script lang="ts">
import "$lib/styles/components.scss"
import { basePath, formOpen, getToken, postRequest, requesting } from "$lib/configuration"
import { onMount } from "svelte";
import { showNotification } from "$lib/components/notificationStore";
import { accountData } from "../account";

let form = false
let activateStep = 0, deactivateStep = 0
let password = '', testCode = ''

let backupCode = '', secret = ''

let gotten = false
let currentlyEnabled = false

onMount(() => {
    postRequest('/api/settings/tfa/status', {
        token: getToken()
    }, (json: any) => {
        gotten = true;
        currentlyEnabled = json.enabled
    })
})

function activation() {

    // Check for tfa test
    if(activateStep == 4) {

        postRequest('/api/settings/tfa/test', {
            token: getToken(),
            code: testCode
        }, (json:any) => {
            if(!json.success) {

                switch(json.message) {
                    case "not_enabled":
                        showNotification("Es ist etwas bei der Aktivierung falschgelaufen.", "red", 3000)
                        break
                }
                return
            }

            activateStep = 0
            formOpen.set(false)
            showNotification("Du hast die Zwei-Faktor Authentifizierung erfolgreich aktiviert!", "green", 5000)
        })

        return
    }

    // Check for tfa activation
    if(activateStep == 2) {

        postRequest('/api/settings/tfa/activate', {
            token: getToken(),
            currentPassword: password
        }, (json:any) => {
            if(!json.success) {

                switch(json.message) {
                    case "invalid.password":
                        showNotification("Dein Passwort ist falsch!", "red", 3000)
                        break
                }
                return
            }

            activateStep++

            secret = json.secret
            backupCode = json.backup
        })

        return
    }

    activateStep++
    form = true
}

function deactivation() {

    // Check for deactivation
    if(deactivateStep == 1) {
        
        postRequest('/api/settings/tfa/deactivate', {
            token: getToken(),
            currentPassword: password
        }, (json: any) => {
            if(!json.success) {

                switch(json.message) {
                    case "invalid.password":
                        showNotification("Dein Passwort ist falsch!", "red", 3000)
                        break
                }
                return
            }

            deactivateStep = 0
            formOpen.set(false)
            showNotification("Du hast die Zwei-Faktor Authentifizierung erfolgreich deaktiviert!", "green", 5000)
        })

        return
    }

    deactivateStep++
    form = true
}

</script>

<div class="panel">
    {#if $requesting}
    <div class="cc">
        <span class="material-icons loading" style="font-size: 75px;">hourglass_empty</span>
    </div>
    {/if}

    {#if !gotten && !$requesting}
    <div class="cc">
        <h2>Es ist etwas schiefgelaufen!</h2>
    </div>
    {/if}

    <!-- Only show if not requesting -->
    {#if !$requesting}
    
    <!-- Main screen -->
    {#if !form && gotten}

    <p>Die Zwei-Faktor Authentifizierung ist derzeitig {currentlyEnabled ? 'aktiviert' : 'deaktiviert'}.</p>
    
    {#if !currentlyEnabled}
    <button on:click={activation}>Aktivieren</button>
    {:else}
    <button on:click={deactivation}>Deaktivieren</button>
    {/if}

    {/if}

    <!-- Activation Step 1: Download App -->
    {#if activateStep == 1}

    <p>Um die Zwei-Faktor Authentifizierung zu aktivieren, musst du zuerst eine Zwei-Faktor Authentifizierungs
         App im jeweiligen App Store herunterladen. Möglichkeiten sind:</p>

    <ul>
        <li><span class="material-icons">shield</span>Google Authenticator <span>EMPFOHLEN</span></li>
        <li><span class="material-icons">lock</span>Microsoft Authenticator</li>
        <li><span class="material-icons">apps</span>Andere Apps mit TOTP Unterstützung.</li>
    </ul>

    <button on:click={activation}>Weiter</button>

    {/if}

    <!-- Activation Step 2: Verify Identity -->
    {#if activateStep == 2}

    <p>Bitte bestätige deine Identität, indem du dein jetziges Passwort eingbist.</p>

    <input bind:value={password} placeholder="Passwort" type="password">
    <button on:click={activation}>Identität bestätigen</button>

    {/if}

    <!-- Activation Step 3: Scan QR Code -->
    {#if activateStep == 3}

    <p>Bitte scanne diesen QR Code, um die Zwei-Faktor Authentifizierung zu aktivieren.</p>

    <div class="cc">
        <img style="{(localStorage.getItem("theme") || 'dark') === 'dark' ? 'filter: invert(100%);' : ''}" 
        src="{basePath}/api/settings/tfa/image?data={secret}&account={$accountData.username}" 
        alt="QR-Code kann nicht geladen werden!"/>
    </div>

    <p>Oder gebe deinen geheimen Code selber ein:</p>
    <p class="copy">{secret}<span on:click={() => {
        navigator.clipboard.writeText(secret)
        showNotification("Geheimen Code kopiert!", "green", 2000)
    }} class="material-icons">content_copy</span></p>

    <h4 style="margin-top: 15px;"><span class="material-icons">notification_important</span>Wichtig</h4>

    <p>Bitte speichere jetzt noch deinen Zurücksetzungscode, falls dein Handy verloren geht.</p>
    <p class="copy">{backupCode}<span on:click={() => {
        navigator.clipboard.writeText(backupCode)
        showNotification("Zurücksetzungscode kopiert!", "green", 2000)
    }} class="material-icons">content_copy</span></p>

    <button on:click={activation}>Weiter</button>

    {/if}

    <!-- Activation Step 4: Validate 2FA -->
    {#if activateStep == 4}

    <p>Als letztes testen wir noch einmal die Zwei-Faktor Authentifizierung. Bitte gebe hier deinen 6-stelligen Code aus der App ein!</p>
    <input bind:value={testCode} placeholder="Code">

    <div class="row">
        <button on:click={activation}>Testen</button>
        <button>2FA deaktivieren</button>
    </div>

    {/if}

    <!-- Deactivation Step 1: Verify identity -->
    {#if deactivateStep == 1}

    <p>Bitte bestätige deine Identität, indem du dein jetziges Passwort eingbist.</p>

    <input bind:value={password} placeholder="Passwort" type="password">
    <button on:click={deactivation}>Identität bestätigen</button>

    {/if}


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
        outline: none;
        border: none;
        width: max-content;
        padding: 0.5em 1em;
        font-size: 20px;
        color: var(--text-color);
        border-radius: 0.4em;
        background-color: var(--box-color);
        cursor: pointer;
        user-select: none;

        &:hover {
            background-color: var(--hover-color);
        }
    }

    ul {
        display: flex;
        flex-direction: column;
        gap: 0.6em;
        list-style: none;

        li {
            display: flex;
            align-items: center;
            gap: 0.3em;
            
            span {
                color: var(--highlight-color);
            }
        }
    }

    input {
        background-color: var(--box-color);
    }

    h4 {
        display: flex;
        align-items: center;
        gap: 0.3em;

        span {
            color: var(--highlight-color);
        }
    }

    .copy {
        padding: 0.5em;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.3em;
        border-radius: 0.4em;
        background-color: var(--box-color);

        span {
            cursor: pointer;
            user-select: none;
            color: var(--highlight-color);
            padding: 0.3em;
            border-radius: 1em;

            &:hover {
                background-color: var(--hover-color);
            }
        }
    }

    img {
        border-radius: 1em;
    }

    .row {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

</style>