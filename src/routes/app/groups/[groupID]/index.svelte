<script lang="ts">
import { goto } from "$app/navigation";
import { page } from "$app/stores";
import { showNotification } from "$lib/components/notificationStore";
import { getToken, postRequest, requesting } from "$lib/configuration";
import { scale } from "svelte/transition";

import { addExamForm, currentExamMap, currentGroup, retrieveGroup } from "$lib/groups/groups";
import { editDescriptionForm, newDescription } from "$lib/groups/overview";
import { customFormat } from "$lib/posts/posts";
import "$lib/styles/components.scss"
import "$lib/styles/form.scss"

let examName = '', examDate: any
let offset = 0

function createExam() {
    if($requesting) return

    // Check if name is valid
    if(examName.length > 32) {
        showNotification("Der Name einer Klassenarbeit darf maximal 32 Zeichen lang sein!", "red", 2000)
        return
    }

    if(examName.length < 3) {
        showNotification("Der Name einer Klassenarbeit muss mindestens 3 Zeichen haben!", "red", 2000)
        return
    }

    // Check if date is valid
    if(examDate == undefined) {
        showNotification("Bitte gebe ein richtiges Datum ein!", "red", 2000)
        return
    }

    // Convert date input to timestamp
    let date = new Date(examDate).getTime()

    postRequest('/api/group/exam/create', {
        token: getToken(),
        name: examName,
        group: $currentGroup.id,
        date: date
    }, (json: any) => {

        if(!json.success) {
            showNotification("Irgendetwas ist schief gelaufen!", "red", 2000)
            return
        }

        showNotification("Klassenarbeit erfolgreich erstellt!", "green", 2000)
        addExamForm.set(false)
        examDate = undefined
        examName = ''

        retrieveGroup(parseInt($page.params.groupID))

    })

}

function refresh() {
    if($requesting) return
    offset = 0
    retrieveGroup(parseInt($page.params.groupID))
}

function loadMore() {
    if($requesting) return
    offset += 20;

    postRequest('/api/group/exam/list', {
        token: getToken(),
        group: $currentGroup.id,
        offset: offset
    }, (json: any) => {
        if(!json.success) return

        // Add dates
        json.exams.forEach((element: any) => {
            element.date = customFormat(new Date(element.date), "#DD#.#MM#.#YYYY#")
        });

        // Set values
        const map = $currentExamMap

        json.exams.forEach((element: any) => {

            if(map.has(element.date)) {
                map.get(element.date).push(element)
            } else {
                map.set(element.date, [element])
            }

        })
        $currentExamMap = $currentExamMap
    })

}

</script>

{#if $addExamForm}
<div class="center-form" in:scale out:scale>
    <div class="form small-form">
        <p>Klassenarbeit erstellen</p>
        <input bind:value={examName} type="title" placeholder="Name">

        <p style="margin-top: 10px;">Datum der Klassenarbeit</p>
        <input bind:value={examDate} type="date" placeholder="Datum">

        <div style="margin-top: 20px;" class="row">
            <button on:click={createExam} class="{$requesting ? 'blocked' : ''}">Erstellen</button>
            <button on:click={() => addExamForm.set(false)}>Zurück</button>
        </div>
    </div>
</div>
{/if}

<div style="margin-top: 1em;" class="container">
    <div class="title">
        <h2>Beschreibung</h2>
        
        {#if $currentGroup.creator}
        <span on:click={() => {

            editDescriptionForm.set(true)
            newDescription.set($currentGroup.description)

        }} style="font-size: 27px;" class="material-icons clickable">edit</span>
        {/if}
    </div>

    <div class="vertical">
        {#if $currentGroup.description}
        
        {#each $currentGroup.description.split('\n') as line}
    
        {#if line.startsWith('# ')}
        <h2>{line.replace('# ', '')}</h2>
        {:else}
        <p>{line} </p>
        {/if}

        {/each}

        {:else}
        <p>Keine Beschreibung!</p>
        {/if}
    </div>

</div>

<div class="container">
    <div class="row">
        <h2>Klassenarbeiten</h2>

        <div class="flex cc-space">

            <span on:click={() => addExamForm.set(!$addExamForm)} style="font-size: 27px;"
                class="material-icons clickable">add</span>

            <span on:click={refresh} style="font-size: 27px;"
                class="material-icons clickable">refresh</span>

        </div>
    </div>

    <div class="spacer">

    </div>

    {#if $currentGroup.exams && $currentGroup.exams[0]}

    {#each Array.from($currentExamMap.keys()) as date}

    <h3>{date}</h3>

    {#each $currentExamMap.get(date) as exam}

    <div class="vertical clickable-vert" on:click={() => goto('/app/exams/' + exam.id)}>
        <div class="row">
            <div class="flex cc-biggap">
                <span style="font-size: 50px;" class="material-icons colored">menu_book</span>
    
                <div class="column">
                    <h3>{exam.name}</h3>
                    <p class="hidden">{exam.date}</p>
                </div>
            </div>

            <span style="font-size: 27px;" class="material-icons">arrow_forward</span>
        </div>
    </div>

    {/each}

    {/each}

    {#if $currentGroup.exams.length >= offset*2}
    <div class="cc">
        <button on:click={loadMore} class="{$requesting ? 'blocked' : ''}">Mehr anzeigen</button>
    </div>
    {/if}

    {:else}

    <div style="margin-top: 4em;" class="cc">
        <h3>Keine Klassenarbeiten gefunden.</h3>
    </div>

    {/if}
</div>

<div class="spacer">

</div>

<style lang="scss">

    .spacer {
        margin-bottom: 2em;
    }

    .title {
        display: flex;
        align-items: center;
        justify-content: space-between;
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

    .clickable-vert {
        cursor: pointer;

        &:hover {
            background-color: var(--box-color);
        }
    }

</style>
