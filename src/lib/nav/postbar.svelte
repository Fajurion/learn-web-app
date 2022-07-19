<script lang="ts">
import { addForm } from "$lib/posts/posts";
import { currentTopic } from "$lib/sidebar/topics";
import { slide } from "svelte/transition";

</script>

{#if $currentTopic.name}
<div in:slide={{duration: 200, delay: 250}} out:slide={{duration: 200}} class="bar">
    <p><span class="material-icons">feed</span>{$currentTopic.name}</p>
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

</style>