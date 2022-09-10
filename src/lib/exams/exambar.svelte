<script lang="ts">
import { goto } from "$app/navigation";
import { page } from "$app/stores";
import { currentExam } from "$lib/exams/exams";
import { slide } from "svelte/transition";
import "$lib/styles/align.scss"

</script>

{#if $currentExam}
<!-- Show if exam exists -->
<div class="bar">

    <p><span class="material-icons">menu_book</span>{$currentExam.name}</p>

    <div class="nav">
        <p on:click={() => goto('/app/exams/' + $currentExam.id + '/')} class="{($page.url.pathname.split('/')[4] || '') === '' ? 'selected' : ''}">Info</p>
        <p on:click={() => goto('/app/exams/' + $currentExam.id + '/topics')} class="{($page.url.pathname.split('/')[4] || '') === 'topics' ? 'selected' : ''}">Themen</p>
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