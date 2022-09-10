<script lang="ts">
import "$lib/styles/components.scss"
import "$lib/styles/align.scss"
import "$lib/styles/form.scss"
import "$lib/styles/input.scss"
import { onMount } from "svelte";
import { formOpen, formTitle, getToken, postRequest, requesting } from "$lib/configuration";
import { page } from "$app/stores";
import { fly } from "svelte/transition"
import { selectionResult, selectionType } from "$lib/components/selector/selectorStore";
import { currentExam } from "$lib/exams/exams";
import { showNotification } from "$lib/components/notificationStore";
import { loadNewTopic } from "$lib/sidebar/topics";
import { goto } from "$app/navigation";
import { onDestroy } from "svelte";

let currentTopics: any[] = []
let offset = 0
let sub: any

function refresh() {
    currentTopics = []
    offset = 0
    loadTopics()
}

onMount(() => {
    loadTopics()

    // When selection is done
    sub = selectionResult.subscribe(value => {
        if(value == undefined || $requesting) return

        postRequest('/api/group/exam/topic/add', {
            token: getToken(),
            topic: value.id,
            exam: $currentExam.id,
            group: $currentExam.groupID
        }, (json: any) => {

            if(!json.success) {

                switch(json.message) {
                    case 'already.added':
                        showNotification('Dieses Thema wurde bereits hinzugefügt!', 'red', 2000)
                        break

                    case 'not_found':
                        showNotification('Du bist nicht in der Gruppe oder die Klassenarbeit existiert nicht!', 'red', 5000)
                        break

                    case 'topic.not_found':
                        showNotification('Dieses Thema wurde nicht gefunden!', 'red', 2000)
                        break
                }

                return
            }

            showNotification('Thema wurde hinzugefügt!', 'green', 2000)
            formOpen.set(false)
            refresh()
        })

    })
})

onDestroy(() => {
    sub()
})

function loadTopics() {

    postRequest('/api/group/exam/topic/list', {
        token: getToken(),
        exam: parseInt($page.params.examID),
        offset: offset
    }, (json: any) => {
        if(!json.success) return

        if(currentTopics[0]) {
            currentTopics = currentTopics.concat(json.topics)
        } else {
            currentTopics = json.topics
        }

        offset += 50
        
    })

}

function removeTopic(id: number) {

    postRequest('/api/group/exam/topic/remove', {
        token: getToken(),
        topic: id,
        exam: $currentExam.id,
        group: $currentExam.groupID
    }, (json: any) => {

        if(!json.success) {

            switch(json.message) {
                case 'not.added':
                    showNotification('Dieses Thema wurde nicht hinzugefügt!', 'red', 2000)
                    break

                case 'not_found':
                    showNotification('Du bist nicht in der Gruppe oder die Klassenarbeit existiert nicht!', 'red', 5000)
                    break

                case 'topic.not_found':
                    showNotification('Dieses Thema wurde nicht gefunden!', 'red', 2000)
                    break
            }

            return
        }

        showNotification('Thema wurde gelöscht!', 'green', 2000)
        formOpen.set(false)
        refresh()

    })

}

</script>

<div class="panel">

    <div style="margin-top: 1em;" class="container">
        <div class="row">
            <h2>Themen</h2>
    
            <div class="row cc-space">

                <span style="font-size: 27px;" class="material-icons clickable" on:click={() => {
                    formOpen.set(true)
                    selectionType.set('topic')
                    formTitle.set('Auswählen')
                }}>add</span>
    
            </div>
        </div>

        {#if currentTopics[0]}

        {#each currentTopics as topic}
        <div class="vertical-small clickable-vert">
            <div class="row">
                <div on:click={() => {
                    loadNewTopic(true, topic.topic)
                    goto('/app/topic/' + topic.topic)
                }} class="flex cc-biggap">
                    <span style="font-size: 27px;" class="material-icons colored">topic</span>
                    <h3>{topic.name}</h3>
                </div>
    
                <div class="row cc-gap">

                    {#if topic.category}
                    <span style="font-size: 27px;" class="material-icons clickable" on:click={() => {
                        loadNewTopic(true, topic.topic)
                    }}>launch</span>
                    {/if}

                    <span style="font-size: 27px;" class="material-icons clickable" on:click={() => {
                        removeTopic(topic.topic)
                    }}>remove</span>
                </div>
            </div>
        </div>
        {/each}

        {#if currentTopics.length > (offset+1)*50}
        <div style="margin-top: 0.7em;" class="cc">
            <button on:click={refresh}>Mehr anzeigen</button>
        </div>
        {/if}

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