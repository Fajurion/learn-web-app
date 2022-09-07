<script lang="ts">
import { page } from "$app/stores";

import { onMount } from "svelte";
import { slide } from "svelte/transition";

    onMount(() => {
        
    })

</script>

<div in:slide={{duration: 250, delay: 250}} out:slide={{duration: 250}} class="bar">
    <div class="items">
        <a href="/app/admin/" class="item {($page.url.pathname.split('/')[3] || '') === '' ? 'selected' : ''}">Konten</a>
        <a href="/app/admin/reports" class="item {($page.url.pathname.split('/')[3] || '') === 'reports' ? 'selected' : ''}">Meldungen</a>
        <a href="/app/admin/invites" class="item {($page.url.pathname.split('/')[3] || '') === 'invites' ? 'selected' : ''}">Einladungen</a>
        <a href="/app/admin/ranks" class="item {($page.url.pathname.split('/')[3] || '') === 'ranks' ? 'selected' : ''}">Ränge</a>
    </div>
</div>

<div class="panel">
    <slot />
</div>

<style lang="scss">

    .bar {
        position: relative;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--menu-color);
        padding: 0.6em 0em;
    }

    .panel {
        position: relative;
        width: 100%;
        max-width: 1400px;
        height: calc(100vh - 3.8em);
        overflow-x: scroll;
        -ms-overflow-style: none;
        scrollbar-width: none;
    }

    .panel::-webkit-scrollbar {
        display: none;
    }

    .item {
        user-select: none;
        text-decoration: none;
        cursor: pointer;
        padding: 0.5em 1em;
        border-radius: 0.3em;
        transition: 250ms ease;
        color: var(--text-color);

        &:hover {
            background-color: var(--hover-color);
        }
    }

    .items {
        padding: 0em 1em;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 0.5em;
    }

    .selected {
        background-color: var(--selected-color);

        &:hover {
            background-color: var(--selected-color);
        }
    }

</style>