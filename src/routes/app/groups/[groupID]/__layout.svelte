<script lang="ts">
import { page } from "$app/stores";

import { currentGroup, retrieveGroup, requesting } from "$lib/groups/groups"
import { editDescriptionForm, changeDescription, newDescription, changeJoinState } from "$lib/groups/overview";
import { fly, scale } from "svelte/transition"
import { onMount } from "svelte";
import Textarea from "$lib/components/textarea.svelte";

let confirmLeave = false
let error = false

onMount(() => {

    if(!$page.params.groupID) {
        error = true
        return
    }

    if(!parseInt($page.params.groupID)) {
        error = true
        return
    }

    retrieveGroup(parseInt($page.params.groupID))

})

</script>

{#if $editDescriptionForm}
<div in:scale out:scale class="center-form">
    <div class="form">
        <p>Beschreibung bearbeiten</p>

        <Textarea bind:value={$newDescription} placeholder="Text"/>

        <button on:click={() => changeDescription($currentGroup.id, $newDescription)} style="margin-top: 20px;">Speichern</button>
        <button on:click={() => editDescriptionForm.set(false)}>Zurück</button>
    </div>
</div>
{/if}

{#if confirmLeave}
<div in:scale out:scale class="center-form">
    <div style="width: 500px;" class="form">
        <p style="font-size: 23px;">Willst du diese Gruppe wirklich verlassen?</p>

        <div style="margin-top: 15px;" class="buttons">
            <button on:click={() => confirmLeave = false}>Abbrechen</button>
            <button on:click={() => {

                confirmLeave = false
                changeJoinState($currentGroup.id, true, () => {
                    $currentGroup.member = !$currentGroup.member
                })

                $currentGroup.member = !$currentGroup.member

            }}>Verlassen</button>
        </div>
    </div>
</div>
{/if}

<div in:fly={{x: 500, delay: 250, duration: 250}} out:fly={{duration: 250, x: -500}} class="panel">

    {#if $requesting}
    <div class="center">
        <span style="font-size: 100px;" class="material-icons loading">hourglass_empty</span>
    </div>
    {/if}

    {#if !error && !$requesting}

    <div class="navbar">
        <h1><span style="font-size: 40px;" class="material-icons">group</span>{$currentGroup.name}</h1>

        {#if $currentGroup.member}
        <button on:click={() => confirmLeave = true}><span style="font-size: 23px;" class="material-icons">done_all</span>Beigetreten</button>
        {:else}
        <button on:click={() => {
            
            changeJoinState($currentGroup.id, false, () => {
                $currentGroup.member = !$currentGroup.member
            })
            
            $currentGroup.member = !$currentGroup.member

        }}><span style="font-size: 23px;" class="material-icons">add</span>Beitreten</button>
        {/if}
    </div>
    
    <slot />
    {/if}
</div>

<style lang="scss">

    .panel {
        width: 95%;
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
        width: 100%;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
    }

    .center-form {
        top: 0;
        left: 0;
        position: absolute;
        width: 100%;
        height: 100vh;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
    }

    .form {
        display: flex;
        justify-content: center;
        padding: 2em;
        border-radius: 1em;
        background-color: var(--box-color);
        flex-direction: column;
        width: 1000px;
        max-width: 85%;
        gap: 0.5em;
        overflow-y: scroll;
        -ms-overflow-style: none;
        scrollbar-width: none;
    }

    .form::-webkit-scrollbar {
        display: none;
    }

    .buttons {
        display: flex;
        justify-content: space-between;
        width: 100%;
    }

    h1 {
        display: flex;
        align-items: center;
        gap: 0.3em;
        font-size: 25px;

        span {
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

    .navbar {
        margin-top: 1.5em;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    button {
        padding: 0.6em 1em;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.3em;
        font-size: 20px;
        border-radius: 0.4em;
        background-color: var(--menu-color);
        color: var(--text-color);
        cursor: pointer;
        transition: 250ms ease;
        outline: none;
        border: none;
        
        span {
            color: var(--highlight-color);
        }

        &:hover {
            background-color: var(--hover-color);
        }
    }
        
        

</style>