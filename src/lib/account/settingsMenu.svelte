<script>
import { goto } from "$app/navigation";


import { formOpen, formTitle, permissions } from "$lib/configuration";
import { logOut, settingType } from "./account";

</script>
<div class="settings">

    <h4 class="heading">Sicherheit</h4>

    <div class="setting">
        <div class="title">
            <p><span class="material-icons">lock_reset</span>Passwort ändern</p>
            <span class="material-icons clickable" on:click={() => {
                formOpen.set(true)
                settingType.set('pw')
                formTitle.set('Ändern')
            }}>edit</span>
        </div>

        <p class="hidden">Ändere dein Account Passwort.</p>
    </div>

    <div class="setting">
        <div class="title">
            <p><span class="material-icons">shield</span>Zwei-Faktor Authentifizierung</p>
            <span on:click={() => {
                formOpen.set(true)
                formTitle.set("2FA")
            }} class="material-icons clickable">launch</span>
        </div>

        <p class="hidden">Klicke auf den Knopf um einen extra Login-Schritt hinzuzufügen und deinen Account sicherer zu machen.</p>
    </div>

    <h4 class="heading">Account</h4>

    <!--
    <div class="setting">
        <div class="title">
            <p><span class="material-icons">account_circle</span>Benutzername ändern</p>
            <span class="material-icons clickable">edit</span>
        </div>

        <p class="hidden">Hier kannst du den Benutzername deines Accounts ändern.</p>
    </div> -->
 
    <div class="setting">
        <div class="title">
            <p>Abmelden</p>
            <span on:click={logOut} class="material-icons clickable">logout</span>
        </div>

        <p class="hidden">Hier kannst du dich aus deinem Account ausloggen.</p>
    </div>

    <h4 class="heading">Plattform</h4>

    {#if $permissions.includes('create.invite')}
    <div class="setting">
        <div class="title">
            <p><span class="material-icons">person_add</span>Einladen</p>
            <span class="material-icons clickable" on:click={() => {
                formOpen.set(true)
                formTitle.set("Einladen")
            }}>launch</span>
        </div>

        <p class="hidden">Hier kannst du Benutzer zur Plattform einladen.</p>
    </div>
    {/if}

    <div class="setting">
        <div class="title">
            <p><span class="material-icons">lock</span>Berechtigungen ansehen</p>
            <span class="material-icons clickable" on:click={() => {
                formOpen.set(true)
                formTitle.set("Berechtigungen")
            }}>launch</span>
        </div>

        <p class="hidden">Sehe alles zu was du auf Learn berechtigt bist.</p>
    </div>

    {#if $permissions.includes('view.admin.panel')}
    <div class="setting">
        <div class="title">
            <p><span class="material-icons">dashboard</span>Zum Adminpanel</p>
            <span on:click={() => {
                goto('/app/admin/reports')
                formOpen.set(false)
            }} class="material-icons clickable">launch</span>
        </div>

        <p class="hidden">Im Adminpanel können erweiterte Einstellungen zur Plattform festgelegt werden.</p>
    </div>
    {/if}

</div>

<style lang="scss">

    .heading {
        margin: 0.5em 0.6em;
        color: var(--text-color);
    }

    .settings {
        width: 100%;
        transition: 250ms ease;
        opacity: 1;
    }

    .setting {
        margin: 0.5em;
        padding: 0.8em 1em;
        border-radius: 0.6em;
        background-color: var(--menu-color);
        gap: 0.5em;
        display: flex;
        flex-direction: column;
        color: var(--text-color);

        .title {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        p {
            display: flex;
            align-items: center;
            gap: 0.3em;

            span {
                color: var(--highlight-color);
            }
        }

    }

    .hidden {
        color: var(--hidden-text-color);
    }

    .clickable {
        cursor: pointer;
        padding: 0.3em;
        border-radius: 1em;

        &:hover {
            background-color: var(--hover-color);
        }
    }

</style>