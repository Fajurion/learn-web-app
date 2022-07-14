<script lang="ts">
import { loadNewTopic, topicList, createTopic, requesting, path } from "./sidebarStore";
import { fly, slide, scale } from "svelte/transition"

    let topicName: string = ''
    let expandAdd = false
    let topicID = 0
    let addChild = false

    function refresh() {
        loadNewTopic(false, 0)
    }

    function create() {
        createTopic(topicName, topicID)
        addChild = false
    }

    function addNewTopic() {
        expandAdd = !expandAdd
    }

    function addChildTopic(id: number) {
        addChild = true
        topicID = id
    }

    function loadChildTopic(id: number, parent: boolean) {
        console.log(id)
        loadNewTopic(parent, id)
    }

</script>

<div class="sidebar">

    {#if !($topicList[0])}
    <div class="no-topics {$requesting ? 'hide' : ''}">

        <h2>Nichts gefunden!</h2>
        <div class="toolbar">
            <span on:click={refresh} style="font-size: 28px;" class="material-icons">refresh</span>
            <span on:click={addNewTopic} style="font-size: 28px;" class="material-icons {expandAdd ? 'selected' : ''}">add</span>
        </div>

        {#if expandAdd}
        <div class="form" in:scale out:scale>
            <p>Thema hinzufügen</p>
            <input bind:value={topicName} type="text" placeholder="Name">
            <button on:click={create}>Hinzufügen</button>
            <button on:click={() => expandAdd = false}>Zurück</button>
        </div>
        {/if}

    </div>
    {/if}

    <div style="margin-top: 5px;" class="toolbar">
        {#if $topicList[0] && $topicList[0].parent != 0}
            <span on:click={() => loadChildTopic($topicList[0].parent, true)} class="material-icons">arrow_back</span>
        {/if}
        <span on:click={() => refresh()} class="material-icons">home</span>
        <span on:click={() => loadChildTopic($topicList[0].parent, false)} class="material-icons">refresh</span>
        {#if $topicList[0]}
            <span on:click={() => addChildTopic($topicList[0].parent)} class="material-icons">add</span>
        {/if}
    </div>
    
    {#each $topicList as topic}
    <div class="topic">
        <p><span class="material-icons">feed</span>{topic.name}</p>

        <div class="toolbar">
            {#if topic.category}
            <span on:click={() => loadChildTopic(topic.id, false)} class="material-icons">arrow_forward_ios</span>
            {:else}
            <span on:click={() => addChildTopic(topic.id)} class="material-icons">add</span>
            {/if}
        </div>
    </div>
    {/each}

    <div class="center {addChild || $requesting ? 'center-shown' : ''}">
        {#if addChild}
        <div class="form" in:scale out:scale>
            <p>Thema hinzufügen</p>
            <input bind:value={topicName} type="text" placeholder="Name">
            <button on:click={create}>Hinzufügen</button>
            <button on:click={() => addChild = false}>Zurück</button>
        </div>
        {/if}
        {#if $requesting}
        <span in:fly out:fly style="font-size: 100px;"class="material-icons loading">hourglass_empty</span>
        {/if} 
    </div>
</div>

<style lang="scss">
    
    .sidebar {
        position: relative;
        width: 100%;
        max-width: 380px;
        height: calc(100vh - 3.8em);
        background-color: var(--menu-color);
    }

    .no-topics {
        position: absolute;
        gap: 0.5em;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        transform: scale(1);
        opacity: 1;
        transition: 250ms ease;
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
            transform: scale(1);

            &:hover {
                color: var(--highlight-color);
                transform: scale(1.15);
            }
        }
    }

    .hide {
        transform: scale(0.8);
        opacity: 0;
    }

    .form {
        position: absolute;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        background-color: var(--box-color);
        gap: 0.5em;
        padding: 0.5em;
        border-radius: 1em;

        input {
            outline: none;
            border: none;
            width: 85%;
            max-width: 400px;
            font-size: 18px;
            padding: 0.5em 0.6em;
            border-radius: 0.3em;
            background-color: var(--menu-color);
            color: var(--text-color);
            transition: 250ms ease;
        }

        button {
            cursor: pointer;
            outline: none;
            border: none;
            width: 85%;
            max-width: 400px;
            font-size: 17px;
            padding: 0.5em 0.6em;
            border-radius: 0.3em;
            background-color: var(--menu-color);
            color: var(--text-color);
            transition: 250ms ease;

            &:hover {
                background-color: var(--hover-color);
            }
        }
    }

    .topic {
        margin: 0.4em;
        padding: 0.3em 0.7em;
        cursor: pointer;
        border-radius: 0.6em;
        transition: 250ms ease;
        font-size: 18px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        &:hover {
            background-color: var(--background-color);
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

    .center {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: -1;
    }

    .center-shown {
        z-index: 3;
    }

    .loading {
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

</style>