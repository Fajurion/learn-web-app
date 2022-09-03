<script context="module" lang="ts">
import Sidebar from "$lib/sidebar/sidebar.svelte";
import Navigation from "$lib/nav/navigation.svelte";
import type { Load } from "@sveltejs/kit"; 
import Notification from "$lib/components/notification.svelte";
import Menu from "$lib/nav/menu.svelte";
import { sidebarOpen, accountOpen } from "$lib/nav/menuStore";

    export const load: Load = ({session}) => {
    
    if(!session.user) {
        return {
            status: 302,
            redirect: '/'
        };
    }

    return {};
}

</script>

<script lang="ts">
    import { page } from "$app/stores";
import AccountMenu from "$lib/account/accountMenu.svelte";
import TwoFactor from "$lib/account/settings/twoFactor.svelte";
import SettingsMenu from "$lib/account/settingsMenu.svelte";
import { formOpen, formTitle } from "$lib/configuration";
import Permissions from "$lib/account/settings/permissions.svelte";
import Invite from "$lib/account/settings/invite.svelte";

    page.subscribe(() => {
        sidebarOpen.set(false)
    })
</script>


<Menu />

<Notification />

<div class="forms {!$formOpen ? 'forms-hidden' : ''}">

    <Notification />

    <div class="form-window {!$formOpen ? 'form-hidden' : ''}">
        <div class="title">
            <h2>{$formTitle}</h2>
            <span on:click={() => formOpen.set(false)} style="font-size: 30px;" class="material-icons">cancel</span>
        </div>

        {#if $formTitle === 'Einstellungen'}
        <SettingsMenu />
        {:else if $formTitle === '2FA'}
        <TwoFactor />
        {:else if $formTitle === 'Berechtigungen'}
        <Permissions />
        {:else if $formTitle === 'Einladen'}
        <Invite />
        {/if}
    </div>
</div>

<div class="main">
    <Navigation />
    <div class="panel">
        <div class="sb {$sidebarOpen ? '' : 'sb-hidden'}">
            <Sidebar />
        </div>
        
        <div class="main-panel">
            <slot />
        </div>

        <div class="account {$accountOpen ? '' : 'account-hidden'}">
            <AccountMenu />
        </div>
    </div>
</div>

<style lang="scss">
    .main {
        width: 100%;
        height: 100vh;
        background-color: var(--background-color);
        color: var(--text-color);
        overflow: hidden;
    }
    
    .panel {
        width: 100%;
        display: flex;
        overflow: hidden;
    }

    .main-panel {
        width: 100%;
        height: 100%;
        overflow: hidden;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
    }

    .sb {
        width: 100%;
        max-width: 380px;
    }

    .account {
        position: absolute;
        right: 0px;
        z-index: 1;
        transition: transform 250ms ease;
    }

    .account-hidden {
        pointer-events: none;
        transform: translate(100%, 0);
    }

    .forms {
        position: absolute;
        z-index: 100;
        top: 0px;
        left: 0px;
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba(0, 0, 0, 0.6);
        transition: 250ms ease;
    }

    .forms-hidden {
        pointer-events: none;
        background-color: rgba(0, 0, 0, 0);
    }

    .form-window {
        border-radius: 1em;
        padding: 0.2em 1.3em 1.3em 1.3em;
        background-color: var(--box-color);
        width: 100%;
        max-width: 500px;
        transition: 250ms ease;
        opacity: 1;
        color: var(--text-color);
        max-height: 100vh;
        overflow-x: scroll;
        -ms-overflow-style: none;
        scrollbar-width: none;
    }

    .form-window::-webkit-scrollbar {
        display: none;
    }

    .form-hidden {
        opacity: 0;
        transform: scale(105%);
        pointer-events: hidden;
    }

    .title {
        user-select: none;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1em 0.5em;
        color: var(--text-color);

        span {
            cursor: pointer;
            padding: 0.2em;
            border-radius: 1em;
            color: var(--highlight-color);

            &:hover {
                background-color: var(--hover-color);
            }
        }
    }

    @media only screen and (max-width: 1400px) {
        .sb {
            position: absolute;
            z-index: 1;
            transition: transform 250ms ease;
        }

        .sb-hidden {
            pointer-events: none;
            transform: translate(-100%, 0);
        }
    }
</style>