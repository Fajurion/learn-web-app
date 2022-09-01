<script lang="ts">
import { settingsOpen } from "$lib/nav/menuStore";

</script>

<div class="settings {!$settingsOpen ? 'settings-hidden' : ''}">

    <h4 class="heading">Sicherheit</h4>

    <div class="setting">
        <div class="title">
            <p><span class="material-icons">lock_reset</span>Passwort ändern</p>
            <span class="material-icons clickable">edit</span>
        </div>

        <p class="hidden">Ändere dein Account Passwort.</p>
    </div>

    <div class="setting">
        <div class="title">
            <p><span class="material-icons">shield</span>Zwei-Faktor Authentifizierung</p>
            <span class="material-icons clickable">launch</span>
        </div>

        <p class="hidden">Klicke auf den Knopf um einen extra Login-Schritt hinzuzufügen und deinen Account sicherer zu machen.</p>
    </div>

    <h4 class="heading">Account</h4>

    <div class="setting">
        <div class="title">
            <p><span class="material-icons">account_circle</span>Benutzername ändern</p>
            <span class="material-icons clickable">edit</span>
        </div>

        <p class="hidden">Fingerprinting speichert Daten deines Browsers um dein Gerät zu identifizieren und dich vor potentiellen Gefahren zu</p>
    </div>

    <div class="setting">
        <div class="title">
            <p><span class="material-icons">contacts</span>Profil bearbeiten<span>BALD</span></p>
            <span class="material-icons clickable">launch</span>
        </div>

        <p class="hidden">Bald kann man hier sein Profilbild setzen und seine eigene Profilseite bearbeiten.</p>
    </div>

    <h4 class="heading">Admin</h4>

    <div class="setting">
        <div class="title">
            <p><span class="material-icons">dashboard</span>Zum Adminpanel</p>
            <span class="material-icons clickable">launch</span>
        </div>

        <p class="hidden">Im Adminpanel können erweiterte Einstellungen zur Plattform festgelegt werden.</p>
    </div>

</div>

<style lang="scss">

    .heading {
        margin: 0.5em 0.6em;
    }

    .settings {
        position: absolute;
        width: 100%;
        transition: 250ms ease;
        opacity: 1;
    }

    .settings-hidden {
        transform-origin: top center;
        transform: translate(100%, 0%);
        pointer-events: none;
    }

    .setting {
        margin: 0.5em;
        padding: 0.8em 1em;
        border-radius: 0.6em;
        background-color: var(--box-color);
        gap: 0.5em;
        display: flex;
        flex-direction: column;

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