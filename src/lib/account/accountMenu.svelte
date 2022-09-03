<script lang="ts">
import { goto } from "$app/navigation";
import { page } from "$app/stores";
import { retrieveGroup } from "$lib/groups/groups";

import { accountOpen, chatOpen } from "$lib/nav/menuStore";

import { onMount } from "svelte";
import { refreshAccount, accountData, groupList } from "./account";
import "$lib/styles/tooltip.scss"
import { formOpen, formTitle } from "$lib/configuration";
 
    onMount(() => {
        refreshAccount()
    })

    function clickLink(url: string) {
        goto(url)
        accountOpen.set(false)
    }

    function loadGroup(id: number) {
        accountOpen.set(false)
        goto('/app/groups/' + id)
        if($page.url.pathname.split('/')[2] === 'groups') {
            retrieveGroup(id)
        }
    }
</script>

<div class="bar">
    <div class="title">
        <div class="column clickable-column b-tooltip" data-ttext="Zu deinem Profil" on:click={() => clickLink('/app/users/' + $accountData.id)}>
            <span class="material-icons">person</span>
            <p>{$accountData.username}</p>
        </div>

        <div class="toolbar">
            <span style="font-size: 26px;" class="material-icons clickable">notifications</span>
            <span on:click={() => chatOpen.set(!$chatOpen)} style="font-size: 26px;" class="material-icons clickable {$chatOpen ? 'selected' : ''}">bookmark</span>
            <span on:click={() => {
                formOpen.set(!$formOpen)
                formTitle.set("Einstellungen")
            }} style="font-size: 26px;" class="material-icons clickable">settings</span>
        </div>
    </div>

    <div class="panel">
        <div class="groups {$chatOpen ? 'groups-hidden' : ''}">
            {#each $groupList as group}
            <div class="group" on:click={() => loadGroup(group.id)}>
                <p><span style="font-size: 28px" class="material-icons">group</span>{group.name}</p>
                
                <span class="material-icons">arrow_forward</span>
            </div>
            {/each}
        </div>
    </div>
</div>

<style lang="scss">

    .bar {
        position: relative;
        width: 100vw;
        max-width: 380px;
        height: calc(100vh - 4.2em);
        background-color: var(--menu-color);
        overflow-y: scroll;
        -ms-overflow-style: none;
        scrollbar-width: none;
        display: flex;
        flex-direction: column;
    }

    .bar::-webkit-scrollbar {
        display: none;
    }

    .title {
        padding: 0.5em 1em;
        display: flex;
        justify-content: space-between;
        background-color: var(--box-color);
        z-index: 10;
    }

    .column {
        display: flex;
        align-items: center;
        gap: 0.3em;
    }

    .toolbar {
        display: flex;
        align-items: center;
        gap: 0.3em;

        span {
            border-radius: 1em;
        }
    }

    .clickable {
        user-select: none;
        cursor: pointer;
        padding: 0.2em;

        &:hover {
            background-color: var(--hover-color);
            color: var(--highlight-color);
        }
    }

    .selected {
        background-color: var(--selected-color);
        color: var(--highlight-color);

        &:hover {
            background-color: var(--selected-color);
        }
    }

    .clickable-column {
        cursor: pointer;
        padding: 0.4em 1em;
        border-radius: 0.5em;

        &:hover {
            background-color: var(--hover-color);
            color: var(--highlight-color);
        }
    }

    .panel {
        position: relative;
    }

    .groups {
        position: absolute;
        width: 100%;
        transition: 250ms ease;
        opacity: 1;
    }

    .groups-hidden {
        transform-origin: top center;
        transform: translate(-100%, 0%);
        pointer-events: none;
    }

    .group {
        margin: 0.3em 0.5em;
        padding: 0.5em 0.7em;
        cursor: pointer;
        border-radius: 0.6em;
        transition: 250ms ease;
        font-size: 18px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        &:hover {
            background-color: var(--hover-color);
        }

        p {
            display: flex;
            align-items: center;
            gap: 0.6em;

            span {
                color: var(--highlight-color);
            }
        }
    }

</style>