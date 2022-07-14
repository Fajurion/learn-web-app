<script lang="ts">
import { showNotification } from "$lib/components/notificationStore";
import { basePath } from "$lib/configuration";

    let username: string = '', password: string = '', confirmPW: string = '', email: string = '', invite: string = '';

    let errorMap = {
        username: false,
        email: false,
        password: false,
        invite: false
    }

    async function register() {

        if(username.length < 3) {
            showNotification('Dein Benutzername muss länger als 3 Zeichen sein!', 'red', 2000)
            errorMap.username = true
            return
        }

        if(username.length > 32) {
            showNotification('Dein Benutzername muss kürzer als 32 Zeichen sein!', 'red', 2000)
            errorMap.username = true
            return
        }

        if(!(password === confirmPW)) {
            showNotification('Die Passwörter stimmen nicht überein!', 'red', 2000)
            errorMap.password = true
            return
        }

        if(password.length > 500) {
            showNotification('Dein Passwort muss kürzer als 500 Zeichen sein!', 'red', 2000)
            errorMap.password = true
            return
        }

        if(password.length < 10) {
            showNotification('Dein Passwort muss länger als 10 Zeichen sein!', 'red', 2000)
            errorMap.password = true
            return
        }

        await fetch(basePath + 'api/account/register', {
            method: 'post',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password,
                invite: invite
            })
        }).then(res => {

            if(res.ok) {
                return res.json()
            } else {
                showNotification('Der Server ist gerade offline. Bitte versuche es später nochmal!', 'red', 5000)
                return;
            }

        }).then(json => {

            if(json.success) {
                showNotification('Du wurdest registriert!', 'green', 2000)

                

                return;
            }

            switch(json.data) {
                case 'register.username.exists':
                    errorMap.username = true
                    showNotification('Dieser Benutzername ist bereits vergeben!', 'red', 2000)
                    break;

                case 'register.email.invalid':
                errorMap.email = true
                    showNotification('Bitte gebe eine richtige E-Mail Adresse an!', 'red', 2000)
                    break;

                case 'register.email.exists':
                    showNotification('Diese E-Mail Adresse ist bereits vergeben!', 'red', 2000)
                    errorMap.email = true
                    break;

                case 'register.invite.not_found':
                    showNotification('Diese Lizenz existiert nicht!', 'red', 2000)
                    errorMap.invite = true
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
        errorMap.username = false
        errorMap.email = false
        errorMap.password = false
        errorMap.invite = false
    }

</script>

<main>
    <div class="form">
        <h2>Registrierung</h2>
        <input on:input={type} class={errorMap.username ? 'error' : ''} bind:value={username} type="text" placeholder="Benutzername">
        <input on:input={type} class={errorMap.email ? 'error' : ''} bind:value={email} type="text" placeholder="E-Mail Adresse">
        <input on:input={type} class={errorMap.password ? 'error' : ''} bind:value={password} type="password" placeholder="Passwort">
        <input on:input={type} class={errorMap.password ? 'error' : ''} bind:value={confirmPW} type="password" placeholder="Passwort wiederholen">
        <input on:input={type} class={errorMap.invite ? 'error' : ''} bind:value={invite} type="password" placeholder="Lizenz">

        <button on:click={register}>Registrieren</button>
    </div>
    
    <p>Du hast einen Account? <a href="/">Login</a></p>
</main>

<style lang="scss">

    main {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        gap: 1.6em;
    }

    h2 {
        font-size: 30px;
        margin-bottom: 30px;
    }

    .form {
        width: 400px;
        max-width: 85%;
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