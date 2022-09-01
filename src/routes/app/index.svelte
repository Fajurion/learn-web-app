<script lang="ts">
import { goto } from "$app/navigation";

    import { fly } from "svelte/transition"
    import { onMount } from "svelte";
    import "$lib/styles/components.scss"
    import "$lib/styles/align.scss"
import { groupList, refreshAccount, accountData } from "$lib/account/account";

    onMount(() => {
        refreshAccount()
    })

</script>

<div out:fly={{x: -500, duration: 250}} in:fly={{x: 500, duration: 250, delay: 250}} class="panel">
    <div class="center">
        <h1><span style="font-size: 50px;" class="material-icons">school</span>Learn</h1>
    </div>

    <div class="container">
        <h2>Zuletzt besucht</h2>

        <div class="horizontal cc">
            <div class="not-clickable">
                <span style="font-size: 50px;" class="material-icons">cancel</span>
                <p style="margin-top: 10px;">Nichts gefunden</p>
            </div>
        </div>
    </div>

    {#if $groupList[0]}
    <div class="container">
        <div class="titlebar">
            <h2>Gruppen</h2>
            <span on:click={() => goto('/app/groups')} style="transform: rotate(180deg);" class="material-icons">arrow_back</span>
        </div>

        <div class="horizontal vertical-scroll">
            {#each $groupList as group}
            <div on:click={() => goto('/app/groups/' + group.id)} class="element">
                <span style="font-size: 100px;" class="material-icons">group</span>
                <p>{group.name.length > 11 ? group.name.substring(0, 11) + ".." : group.name}</p>
            </div>
            {/each}
        </div>
    </div>
    {/if}

    <div class="container">
        <h2>Neu bei Learn?</h2>

        <div class="horizontal">
            <div on:click={() => goto('/app/groups')} class="element">
                <span style="font-size: 100px;" class="material-icons">group_add</span>
                <p>Gruppe finden</p>
            </div>

            <div on:click={() => goto('/app/guides')} class="element">
                <span style="font-size: 100px;" class="material-icons">quiz</span>
                <p>Hilfe</p>
            </div>
        </div>
    </div>
</div>

<style lang="scss">

    .panel {
        width: 95%;
        padding: 0.5em;
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

    h1 {
        display: flex;
        align-items: center;
        gap: 0.3em;
        margin: 1em 2em;

        span {
            color: var(--highlight-color);
        }
    }

    .titlebar {
        display: flex;
        width: 100%;
        align-items: center;
        gap: 0.7em;

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

    .vertical-scroll {
        overflow-x: scroll;
        -ms-overflow-style: none;
        scrollbar-width: none;
        overscroll-behavior-inline: contain;
    }

    .vertical-scroll::-webkit-scrollbar {
        display: none;
    }

</style>