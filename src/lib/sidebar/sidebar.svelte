<script lang="ts">
import { loadNewTopic, topicList, createTopic, currentTopic } from "$lib/sidebar/topics";
import { fly, scale, slide } from "svelte/transition"
import { goto } from '$app/navigation';
import { page } from '$app/stores'
import { onMount } from "svelte";
import { loadPosts } from "$lib/posts/posts";
import { permissions, requesting, requestURL } from "$lib/configuration";
import "$lib/styles/input.scss"
import "$lib/styles/align.scss"
import { listTasks, resetNew, taskFilterDifficulty, taskFilterSorting, taskSearchQuery } from "$lib/tasks/tasks";

    let topicName: string = ''
    let expandAdd = false
    let topicID = 0
    let addChild = false

    let search = false
    let searchQuery = ''

    let childHovered = false

    // Executed on startup
    onMount(() => {

        // Check if there is a topic id in the url
        if($page.params.topicID) {

            if (!parseInt($page.params.topicID)) {
                refresh()
                return
            }

            // Load topic by topic id
            loadNewTopic(true, parseInt($page.params.topicID))
        } else refresh()
    })

    // Refresh current topic
    function refresh() {
        loadNewTopic(false, 0)
    }

    // Create a new topic
    function create() {
        createTopic(topicName, topicID)
        addChild = false
    }

    // Hides/shows topic addition form
    function addNewTopic() {
        expandAdd = !expandAdd
    }

    // Add a child topic
    function addChildTopic(id: number) {
        addChild = true
        topicID = id
    }

    // Load child topic of a parent
    function loadChildTopic(id: number, parent: boolean) {
        loadNewTopic(parent, id)
        childHovered = false
    }

    // Click topic
    function clickTopic(id: number) {
        console.log(id)
        if(childHovered) return
        console.log(id + "weird")

        if($page.url.pathname.includes('tasks')) {
            goto('/app/topic/' + id + '/tasks')

            resetNew()
            listTasks([], 0, $taskSearchQuery, $taskFilterDifficulty, $taskFilterSorting, id)

        } else {
            goto('/app/topic/' + id)
            loadPosts('', 0, id, 0)
        }

        $topicList.forEach(element => {
            if(element.id == id) {
                currentTopic.set(element)
            }
        })

    }

    // Hide/show search field
    function clickSearch() {
        search = !search
        if(search) {
            searchQuery = ''
            setTimeout(() => {
                // @ts-ignore
                document.querySelector('#searchinput').focus()
            }, 100);
        }
    }

</script>

<!-- Sidebar -->
<div class="sidebar">

    <!-- Only show if there aren't any topics -->
    {#if !($topicList[0])}

    <!-- Error message in case of no topics -->
    <div class="no-topics {$requesting ? 'hide' : ''}">

        <h2>Nichts gefunden!</h2>
        <div class="toolbar">
            <span on:click={refresh} style="font-size: 28px;" class="material-icons">refresh</span>
            <span on:click={addNewTopic} style="font-size: 28px;" class="material-icons {expandAdd ? 'selected' : ''}">add</span>
        </div>

        <!-- Only show if adding form is shown -->
        {#if expandAdd}

        <!-- Topic addition form -->
        <div class="form" in:scale out:scale>
            <p>Thema hinzufügen</p>
            <input bind:value={topicName} type="text" placeholder="Name">
            <button on:click={create}>Hinzufügen</button>
            <button on:click={() => expandAdd = false}>Zurück</button>
        </div>
        {/if}

    </div>

    <!-- Show if there are topics -->
    {:else}

    <!-- Icon bar at the top of sidebar -->
    <div in:scale style="margin-top: 5px;" class="toolbar">
        {#if $topicList[0] && $topicList[0].parent != 0}
            <p class="b-tooltip" data-ttext="Ein Thema zurück"><span in:fly={{duration: 250}} out:fly={{duration: 250}} on:click={() => loadChildTopic($topicList[0].parent, true)} class="material-icons">arrow_back</span></p>
        {/if}
        <p class="b-tooltip" data-ttext="Zurück zur Startseite"><span on:click={() => refresh()} class="material-icons">home</span></p>
        <p class="b-tooltip" data-ttext="Themen durchsuchen"><span on:click={clickSearch} class="material-icons {search ? 'selected' : ''}">search</span></p>
        <p class="b-tooltip" data-ttext="Themen neuladen"><span on:click={() => loadChildTopic($topicList[0].parent, false)} class="material-icons">refresh</span></p>
        {#if $topicList[0]}
            <p class="b-tooltip" data-ttext="Neues Thema erstellen"><span in:fly={{duration: 250}} out:fly={{duration: 250}} on:click={() => addChildTopic($topicList[0].parent)} class="material-icons">add</span></p>
        {/if}
    </div>
    {/if}

    <!-- Search bar -->
    {#if search}
    <div in:slide out:slide class="cc">
        <input id="searchinput" bind:value={searchQuery} placeholder="Suche" class="darker scale">
    </div>
    {/if}
    
    <!-- Iterate through current list of topics -->
    {#each $topicList as topic}

    <!-- Apply search query -->
    {#if !search || (search && topic.name.startsWith(searchQuery))}

    <!-- Topic container -->
    <div class="topic {$page.params.topicID && $page.params.topicID == topic.id ? 'selected' : ''}">
        <p on:click={() => clickTopic(topic.id)}><span class="material-icons">topic</span>{topic.name}</p>

        <!-- Delete / go into topic button -->
        <div class="toolbar">

            <!-- Only show if topic has children -->
            {#if topic.category}
            <span style="transform: rotate(180deg);" on:click={() => loadChildTopic(topic.id, false)} class="material-icons">arrow_back</span>

            <!-- Only show if topic doesn't have children -->
            {:else}

            {#if $permissions.includes('delete.topic')}
            <span class="material-icons">delete</span>
            {/if}
            <span on:click={() => addChildTopic(topic.id)} class="material-icons">add</span>

            {/if}
        </div>

    </div>

    {/if}
    {/each}

    <!-- Centered div -->
    <div class="center {addChild || $requesting ? 'center-shown' : ''}">

        <!-- Only show if add topic form is visible -->
        {#if addChild}

        <!-- Add topic form -->
        <div class="form" in:scale out:scale>
            <p>Thema hinzufügen</p>
            <input bind:value={topicName} type="text" placeholder="Name">
            <button on:click={create}>Hinzufügen</button>
            <button on:click={() => addChild = false}>Zurück</button>
        </div>
        {/if}

        <!-- Only show if topics are loading -->
        {#if $requesting && $requestURL.includes('topic')}

        <!-- Loading circle -->
        <span in:fly out:fly style="font-size: 100px;"class="material-icons loading">hourglass_empty</span>
        {/if}
    </div>
</div>

<style lang="scss">
    
    .sidebar {
        position: relative;
        width: 100%;
        max-width: 380px;
        height: calc(100vh - 4.2em);
        background-color: var(--menu-color);
        overflow-y: scroll;
        -ms-overflow-style: none;
        scrollbar-width: none;
    }

    .sidebar::-webkit-scrollbar {
        display: none;
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

            &:hover {
                color: var(--highlight-color);
            }
        }
        
        .selected {
            background-color: var(--selected-color);
            color: var(--highlight-color);
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
            background-color: var(--hover-color);
        }

        p {
            display: flex;
            align-items: center;
            gap: 0.3em;
            width: 100%;

            span {
                color: var(--highlight-color);
            }
        }
    }

    .selected {
        background-color: var(--selected-color);

        &:hover {
            background-color: var(--selected-color);
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