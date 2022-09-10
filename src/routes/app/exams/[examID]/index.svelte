<script lang="ts">
import "$lib/styles/components.scss"
import "$lib/styles/align.scss"
import "$lib/styles/form.scss"
import "$lib/styles/input.scss"

import { currentExam } from "$lib/exams/exams"
import { scale } from "svelte/transition"
import Textarea from "$lib/components/textarea.svelte"
import SimpleTextRender from "$lib/render/simpleTextRender.svelte"
import { formOpen, formTitle, getToken, postRequest, requesting } from "$lib/configuration";
import { showNotification } from "$lib/components/notificationStore";

let editBoard = false
let board = 'Deine Mutter ist fett'

currentExam.subscribe(() => {
    board = $currentExam.board
})

function saveBoard() {
    if($requesting) return

    postRequest("/api/group/exam/board", {
        token: getToken(),
        board: board,
        exam: $currentExam.id
    }, (json: any) => {
        if(!json.success) {
            showNotification("Irgendetwas ist schiefgelaufen!", "red", 5000)
            return
        }

        showNotification("Board erfolgreicht aktualisiert!", "green", 2000)
        editBoard = false
        $currentExam.board = board

    })

}

</script>

{#if editBoard}

<div in:scale out:scale class="center-form">
    <div class="form">
        <p>Board bearbeiten ({board.length} / 500)</p>

        <Textarea blocked={board.length > 500} bind:value={board} placeholder="Board" />

        <div style="margin-top: 10px;" class="row">
            <button on:click={() => {
                editBoard = false
            }}>Zurück</button>

            <button on:click={saveBoard} class="{board.length > 500 || $requesting ? 'blocked' : ''}">Speichern</button>
        </div>
    </div>
</div>

{/if}

<div class="panel">
    
    <div style="margin-top: 1em;" class="container">

        <div class="row">
            <h2>Board</h2>

            <div class="row cc-space">

                <span style="font-size: 27px;" class="material-icons clickable" on:click={() => {
                    editBoard = !editBoard
                }}>edit</span>

                <span style="font-size: 27px;" class="material-icons clickable" on:click={() => {
                    formOpen.set(true)
                    formTitle.set('Melden')
                }}>report</span>

            </div>
        </div>

        {#if $currentExam}
        <div class="vertical">

            {#if $currentExam.board == ''}
            <p>Das Board wurde noch nicht bearbeitet.</p>
            {:else}
            <SimpleTextRender text={$currentExam.board} />
            {/if}
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

</style>