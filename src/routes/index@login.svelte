<script lang="ts">
import { goto } from "$app/navigation";

import Notification from "$lib/components/notification.svelte";
import { showNotification } from "$lib/components/notificationStore";
import { basePath } from "$lib/configuration";

    let username: string, password: string;

    let error = false

    function login() {

        fetch(basePath + '/api/account/login', {
            method: 'post',
            headers: {
                'Content-Type':' application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        }).then(res => {

            if(res.ok) {
                return res.json()
            } else {
                throw error;
            }

        }).then(json => {
            console.log(json)

            if(json.success) {
                showNotification('Du wirst weitergeleitet..', 'green', 2000)

                document.cookie = "token=" + json.data.split(':')[1] + "; SameSite=Strict; Secure"

                if(json.data.split(':')[0] === 'tfa') goto('/tfa')
                else location.assign("/app")

                return;
            }

            switch(json.data) {
                case 'login.invalid':
                    showNotification('Falsche Anmeldedaten!', 'red', 1000)
                    error = true
                    break;
                case 'server.error':
                    showNotification('Der Server ist gerade offline. Bitte versuche es später nochmal!', 'red', 5000)
                    break;
                case 'too_many_sessions':
                    showNotification('Du bist mit zu vielen Geräten angemeldet!', 'red', 5000)
                    break;
            }
        }).catch(() => showNotification('Der Server ist gerade offline. Bitte versuche es später nochmal!', 'red', 5000))
                    
    }

    function type() {
        error = false
    }
</script>

<main>
    <div class="form">
        <h2>Anmeldung</h2>
        <input on:input={type} class={error ? 'error' : ''} bind:value={username} type="text" placeholder="Benutzername">
        <input on:input={type} class={error ? 'error' : ''} bind:value={password} type="password" placeholder="Passwort">
        <button on:click={login}>Anmelden</button>
    </div>
    <p>Passwort vergessen? <a href="/forgot">Passwort vergessen</a></p>
    <p>Kein Account? <a href="/register">Registrieren</a></p>
</main>

<style lang="scss">

    main {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        gap: 1.3em;
    }

    h2 {
        font-size: 30px;
        margin-bottom: 30px;
    }

    .form {
        transform: 250ms ease;
        width: 100%;
        max-width: 400px;
        padding: 1.6em 1.2em;
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: var(--box-color);
        border-radius: 1em;
    }
    
    input {
        margin-top: 10px;
        outline: none;
        border: none;
        width: 85%;
        max-width: 400px;
        font-size: 18px;
        padding: 0.5em 0.6em;
        border-radius: 0.3em;
        background-color: var(--menu-color);
        color: var(--text-color);
        transition: 250ms ease;
        border: 2px solid var(--menu-color);
    }

    .error {
        border: 2px solid red;
    }

    p a {
        margin-left: 5px;
    }
    
    button, a {
        text-decoration: none;
        margin-top: 20px;
        outline: none;
        border: none;
        width: 85%;
        max-width: 400px;
        font-size: 18px;
        padding: 0.5em 1em;
        border-radius: 0.3em;
        background-color: var(--menu-color);
        color: var(--text-color); 
        transition: 250ms ease;
        cursor: pointer;

        &:hover {
            background-color: var(--hover-color);
        }
    }
</style>