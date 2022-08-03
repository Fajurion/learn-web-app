<script lang="ts">
import { addForm } from "$lib/posts/posts";
import { currentTopic } from "$lib/sidebar/topics";
import { slide } from "svelte/transition";
import { page } from "$app/stores";
import { goto } from "$app/navigation";

</script>

<!-- Show only if a topic is open -->
{#if $currentTopic.name}

<!-- Titlebar above post/task/my stuff section -->
<div in:slide={{duration: 200, delay: 250}} out:slide={{duration: 200}} class="bar">

    <!-- Text with current topic -->
    <p><span class="material-icons">feed</span>{$currentTopic.name}</p>

    <!-- Selection of what to view -->
    <div class="nav">
        <p on:click={() => goto('/app/topic/' + $currentTopic.id + '/created')} class="{($page.url.pathname.split('/')[4] || '') === 'created' ? 'selected' : ''}">Meine Sachen</p>
        <p on:click={() => goto('/app/topic/' + $currentTopic.id + '/')} class="{($page.url.pathname.split('/')[4] || '') === '' ? 'selected' : ''}">Beiträge</p>
        <p on:click={() => goto('/app/topic/' + $currentTopic.id + '/tasks')} class="{($page.url.pathname.split('/')[4] || '') === 'tasks' ? 'selected' : ''}">Aufgaben</p>
    </div>

    <!-- Buttons on the right -->
    <div class="toolbar">
        <span class="material-icons">info</span>
        <span on:click={() => addForm.set(true)} class="material-icons">add</span>
    </div>
</div>
{/if}

<style lang="scss">
    
    .bar {
        display: flex;
        justify-content: space-between;
        background-color: var(--menu-color);
        padding: 0.4em 2em;
        align-items: center;
        width: calc(100% - 4em);

        p {
            display: flex;
            align-items: center;
            gap: 0.3em;

            span {
                color: var(--highlight-color);
            }
        }
    }

    .toolbar {
        display: flex;
        justify-content: center;
        gap: 0.3em;
        user-select: none;
        transition: 250ms ease;
        transform: scale(1);
        opacity: 1;

        span {
            padding: 0.2em;
            background-color: var(--box-color);
            border-radius: 1em;
            transition: 250ms ease;
            cursor: pointer;

            &:hover {
                color: var(--highlight-color);
            }
        }
    }

    .nav {
        display: flex;
        gap: 0.6em;
        align-items: center;

        p {
            cursor: pointer;
            padding: 0.5em 1em;
            border-radius: 0.3em;
            transition: 250ms ease;

            &:hover {
                background-color: var(--hover-color);
            }
        }
    
        .selected {
            background-color: var(--selected-color);

            &:hover {
                background-color: var(--selected-color);
            }
        }
    }

</style>