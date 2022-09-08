<script lang="ts">
import "$lib/styles/components.scss"
import "$lib/styles/align.scss"
import "$lib/styles/form.scss"
import "$lib/styles/input.scss"
import { onMount } from "svelte";
import { formOpen, formTitle, getToken, postRequest } from "$lib/configuration";
import { page } from "$app/stores";
import { fly } from "svelte/transition"

let currentTopics: any[] = []
let offset = 0

onMount(() => loadTopics())

function loadTopics() {

    postRequest('/api/group/exam/topic/list', {
        token: getToken(),
        exam: parseInt($page.params.examID),
        offset: offset
    }, (json: any) => {
        console.log(json)
        if(!json.success) return

        if(currentTopics[0]) {
            currentTopics = currentTopics.concat(json.topics)
        } else {
            currentTopics = json.topics
        }
        
    })

}

</script>

<div in:fly={{x: 600, duration: 200, delay: 250}} out:fly={{x: -600, duration: 200}} class="panel">

    <div style="margin-top: 1em;" class="container">
        <div class="row">
            <h2>Themen</h2>
    
            <div class="row cc-space">
    
                <span style="font-size: 27px;" class="material-icons clickable" on:click={() => {
                    formOpen.set(true)
                    formTitle.set('Auswählen')
                }}>add</span>
    
            </div>
        </div>

        {#if currentTopics[0]}

        {#each currentTopics as topic}
        <div class="vertical-small clickable-vert">
            <div class="row">
                <div on:click={() => {
                    // Open topic
                }} class="flex cc-biggap">
                    <span style="font-size: 27px;" class="material-icons colored">topic</span>
                    <h3>{topic.name}</h3>
                </div>
    
                <div class="row cc-gap">
                    <span style="font-size: 27px;" class="material-icons clickable" on:click={() => {
                        // Open in sidebar
                    }}>launch</span>

                    <span style="font-size: 27px;" class="material-icons clickable" on:click={() => {
                        // Remove topic from exam
                    }}>remove</span>
                </div>
            </div>
        </div>
        {/each}

        {:else}

        <div class="cc">
            <h3>Keine Themen gefunden!</h3>
        </div>

        {/if}

    </div>

</div>

<style lang="scss">

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

    .clickable {
        padding: 0.3em;
        border-radius: 1em;
        transition: 250ms ease;
        cursor: pointer;

        &:hover {
            color: var(--highlight-color);
            background-color: var(--hover-color);
        }
    }

    .clickable-vert:hover {
        cursor: pointer;
        background-color: var(--box-color);
    }

</style>