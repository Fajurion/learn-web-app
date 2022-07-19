<script lang="ts">
import { goto } from "$app/navigation";

import { fly } from "svelte/transition";


</script>

<div in:fly={{x: 500, delay: 250, duration: 250}} out:fly={{duration: 250, x: -500}} class="panel">

    <div class="search">
        <span on:click={() => goto('/app')} style="font-size: 30px;" class="material-icons clickable">arrow_back</span>
        <input type="text" placeholder="Suchen..">
        <span style="font-size: 30px;" class="material-icons clickable">add</span>
    </div>

</div>

<style lang="scss">
    .panel {
        width: 100%;
        max-width: 1400px;
        height: calc(100vh - 3.8em);
    }

    .center {
        width: 100%;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
    }

    .search {
        margin-top: 2em;
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

</style>