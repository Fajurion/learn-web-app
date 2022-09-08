<script lang="ts">
import { getToken, postRequest, requesting, requestURL } from "$lib/configuration";
import "$lib/styles/input.scss";
import "$lib/styles/align.scss";
import "$lib/styles/tooltip.scss";

import { onMount } from "svelte";
import { showNotification } from "../notificationStore";
import { selectionResult } from "./selectorStore";

    let currentParentID = -1, offset = 0
    let currentParent = '', searchQuery = ''

    let currentArray: any[] = []

    onMount(() => search())

    function search() {

        postRequest('/api/topic/search', {
            token: getToken(),
            query: '%' + searchQuery + '%',
            parent: currentParentID,
            offset: 0
        }, (json: any) => {

            if(!json.success) {
                showNotification('Irgendetwas ist schief gelaufen!', "red", 5000)
                return
            }

            if(offset == 0) {
                currentArray = json.topics
            } else {
                currentArray = currentArray.concat(json.topics)
            }

            offset += 50

        })

    }

    function onSearch() {
        offset = 0;
        search()
    }

</script>

<div class="panel">

    <div class="row cc-space">
        <input class="full-width" on:input={onSearch} bind:value={searchQuery} placeholder="Suchen">

        <span class="material-icons clickable" on:click={() => {
            offset = 0
            search()
        }}>refresh</span>
    </div>

    {#if currentParent != ''}
    <div class="parent cc-biggap">
        <div class="row cc-gap">
            <span class="material-icons colored">folder</span>
            <p>{currentParent}</p>
        </div>

        <span class="material-icons" on:click={() => {
            currentParent = ''
            currentParentID = -1
            onSearch()
        }}>close</span>
    </div>
    {/if}

    {#if $requesting && $requestURL === '/api/topic/search'}
    <div class="cc">
        <span class="material-icons loading" style="font-size: 75px;">hourglass_empty</span>
    </div>
    {/if}

    {#each currentArray as topic}
    <div class="row topic">
        <div class="flex cc-gap" on:click={() => {
            if($selectionResult == topic) return

            // Select
            $selectionResult = topic
        }}>
            <span class="material-icons colored">topic</span>
            <p>{topic.name}</p>
        </div>

        {#if topic.category}
        <p><span class="material-icons clickable-small" on:click={() => {
            // Make parent
            currentParent = topic.name
            currentParentID = topic.id
            onSearch()
        }}>launch</span></p>
        {/if}
    </div>
    {/each}

    {#if currentArray.length >= (offset+1)*50}
    <div style="margin-top: 0.6em;" class="cc">
        <button on:click={search}>Mehr anzeigen</button>
    </div>
    {/if}

</div>

<style lang="scss">
    
    .panel {
        width: calc(100% - 0.3em);
    }

    input {
        overflow: hidden;
        display: flex;
        align-items: center;
        padding: 0.6em;
        width: 300px;
        max-width: 100%;
        border-radius: 0.5em;
        background-color: var(--menu-color);
    }

    .parent {
        margin-top: 0.7em;
        width: max-content;
        padding: 0.6em;
        border-radius: 0.5em;
        background-color: var(--menu-color);

        display: flex;
        align-items: center;

        span:hover {
            cursor: pointer;
            color: var(--highlight-color);
        }
    }

    span {
        user-select: none;
    }

    .clickable {
        cursor: pointer;
        padding: 0.4em;
        border-radius: 1em;
        
        &:hover {
            background-color: var(--hover-color);
            color: var(--highlight-color);
        }
    }

    .clickable-small {
        cursor: pointer;
        
        &:hover {
            color: var(--highlight-color);
        }
    }

    .topic {
        cursor: pointer;
        padding: 0.5em 0.6em;
        margin: 0.4em;
        border-radius: 0.5em;
        background-color: var(--menu-color);

        &:hover {
            background-color: var(--hover-color);
        }
    }

</style>