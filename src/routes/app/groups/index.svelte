<script lang="ts">
import { goto } from "$app/navigation";
import { groupList, listGroups, requesting, addForm, createGroup, searchQuery, currentGroup } from "$lib/groups/groups";

import { fly, scale } from "svelte/transition";
import { onMount } from 'svelte';

let title = ''

onMount(() => listGroups($searchQuery))

function addGroup() {
    createGroup(title)
    title = ''
}

function gotoGroup(group: any) {
    goto('/app/groups/' + group.id)
}

</script>

{#if $addForm}
<div in:scale out:scale class="center-form">
    <div class="form">
        <p>Gruppe erstellen</p>

        <input bind:value={title} type="title" placeholder="Name">

        <button on:click={addGroup} style="margin-top: 20px;">Erstellen</button>
        <button on:click={() => addForm.set(false)}>Zurück</button>
    </div>
</div>
{/if}

<div in:fly={{x: 500, delay: 250, duration: 250}} out:fly={{duration: 250, x: -500}} class="panel">
    
    <div class="search">
        <span on:click={() => goto('/app')} style="font-size: 30px;" class="material-icons clickable">arrow_back</span>
        <input type="text" bind:value={$searchQuery} on:input={() => listGroups($searchQuery)} placeholder="Suchen..">
        <span on:click={() => addForm.set(true)} style="font-size: 30px;" class="material-icons clickable">add</span>
    </div>

    {#if !$groupList[0] && !$requesting}
    <div in:fly class="center">
        <p>Keine Gruppen gefunden!</p>
        <span on:click={() => listGroups($searchQuery)} class="material-icons clickable">refresh</span>
    </div>
    {/if}

    <div class="groups">
        {#each $groupList as group}
        <div on:click={() => gotoGroup(group)} class="group">
            <div class="inner">
                <span style="font-size: 50px;" class="material-icons">group</span>
    
                <div class="content">
                    <h3>{group.name}</h3>
                    <p>{group.memberCount == 1 ? '1 Mitglied' : group.memberCount + 'Mitglieder'}</p>
                </div>
            </div>
            <span style="font-size: 30px;" class="material-icons">arrow_forward</span>
        </div>
        {/each}

        {#if $groupList.length == 12}
        <h2 style="margin-top: 1em; margin-bottom: 2em;">Nicht gefunden? Benutze die Suchleiste!</h2>
        {/if}
    </div>

    {#if $requesting}
    <div in:fly class="center">
        <span style="font-size: 100px;" class="material-icons loading">hourglass_empty</span>
    </div>
    {/if}

</div>

<style lang="scss">
    .panel {
        width: 100%;
        padding: 0.3em;
        max-width: 1400px;
        height: calc(100vh - 3.8em);
        overflow-x: scroll;
        -ms-overflow-style: none;
        scrollbar-width: none;
    }

    .panel::-webkit-scrollbar {
        display: none;
    }

    .center {
        margin-top: 2em;
        width: 100%;
        gap: 0.5em;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0.3em;

        p {
            font-size: 20px;
        }
    }

    button {
        text-decoration: none;
        outline: none;
        border: none;
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

    .search {
        margin-top: 1em;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.3em;

        input {
            outline: none;
            border: none;
            width: 85%;
            max-width: 400px;
            font-size: 19px;
            padding: 0.5em 0.6em;
            border-radius: 0.3em;
            background-color: var(--menu-color);
            color: var(--text-color);
        }
    }

    .clickable {
        padding: 0.2em;
        border-radius: 1em;
        background-color: var(--box-color);
        user-select: none;
        cursor: pointer;
        transition: color 250ms ease;

        &:hover {
            color: var(--highlight-color);
        }
    }

    .loading {
        user-select: none;
        animation: loading 1s infinite;
    }

    @keyframes loading {
        1% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }

    .center-form {
        z-index: 1;
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        gap: 0.5em;
        width: 100%;
        height: 100%;
    }

    .form {
        display: flex;
        justify-content: center;
        padding: 2em;
        border-radius: 1em;
        background-color: var(--box-color);
        flex-direction: column;
        width: 500px;
        max-width: 85%;
        gap: 0.5em;
        overflow-y: scroll;
        -ms-overflow-style: none;
        scrollbar-width: none;
    }

    .form::-webkit-scrollbar {
        display: none;
    }

    input {
        height: 1em;
        overflow: hidden;
        resize: none;
        outline: none;
        border: none;
        font-size: 18px;
        padding: 0.5em 0.6em;
        border-radius: 0.3em;
        background-color: var(--menu-color);
        color: var(--text-color);
        transition: 250ms ease;
    }

    .groups {
        margin-top: 0.6em;
        margin-bottom: 1.2em;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        gap: 0.6em;
        padding: 0.3em;
    }

    .group {
        padding: 0.8em;
        width: 85%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-radius: 0.6em;
        cursor: pointer;

        background-color: var(--menu-color);
        transition: background-color 250ms ease;

        .inner {
            display: flex;
            align-items: center;
            gap: 0.6em;

            div {
                display: flex;
                flex-direction: column;
            }

            span {
                color: var(--highlight-color);
            }
        }

        &:hover {
            background-color: var(--box-color);
        }
    }

</style>