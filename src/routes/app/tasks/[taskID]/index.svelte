<script lang="ts">
import { page } from "$app/stores";
import { formOpen, formTitle, getToken, postRequest, requesting, requestURL } from "$lib/configuration";
import { onMount } from "svelte";

import "$lib/styles/components.scss"
import "$lib/styles/align.scss"
import "$lib/styles/tooltip.scss"
import "$lib/styles/input.scss"
import { fly, slide } from "svelte/transition";
import { goto } from "$app/navigation";

    let currentTask: any;
    let wrongAnswers: string[] = [], correctAnswers: string[] = []
    let gotCorrect = false
    let showSolution = false

    onMount(() => {
        currentTask = undefined
        if(!parseInt($page.params.taskID)) {
            return
        }

        const taskID = parseInt($page.params.taskID)

        postRequest('/api/task/get', {
            token: getToken(),
            task: taskID
        }, (json: any) => {
            if(!json.success) {
                return
            }

            currentTask = json.task
        })

    })

    function checkAnswer(answer: string) {
        if(currentTask.content.split(':')[1] === answer) {
            correctAnswers = correctAnswers
            correctAnswers.push(answer)
            gotCorrect = true
        } else {
            wrongAnswers = wrongAnswers
            wrongAnswers.push(answer)
        }
    }

    function likeButton() {
        if($requesting) return
        currentTask.liked = !currentTask.liked

        // If liked
        if(currentTask.liked) {

            // then like the post
            postRequest('/api/task/like', {
                token: getToken(),
                task: currentTask.id
            }, (json: any) => {
                if(!json.success) {
                    currentTask.liked = !currentTask.liked
                }
            })
        } else { // if not liked

            // then unlike the post
            postRequest('/api/task/unlike', {
                token: getToken(),
                task: currentTask.id
            }, (json: any) => {
                if(!json.success) {
                    currentTask.liked = !currentTask.liked
                }
            })
        }
    }

</script>

<div class="panel">

    {#if $requesting && $requestURL.includes('task/get')}
    <div style="margin-top: 5em;" class="cc">
        <span style="font-size: 100px;" class="material-icons loading">hourglass_empty</span>
    </div>
    {/if}

    {#if !$requesting && currentTask == null}
    <div in:fly style="margin-top: 5em;" class="cc">
        <h2>Diese Aufgabe wurde nicht gefunden!</h2>
    </div>
    {/if}

    {#if currentTask}
    <div in:fly class="rect row">
        <h3 class="cc cc-gap"><span class="material-icons colored">task</span>{currentTask.title}</h3>

        <div class="tools cc-gap">
            <p class="b-tooltip" data-ttext="Bewerten"><span on:click={likeButton} class="material-icons clickable 
                {currentTask.liked ? 'selected' : ''}">favorite</span></p>

            <p class="b-tooltip" data-ttext="Melden"><span on:click={() => {
                formOpen.set(true)
                formTitle.set('Melden')
            }} class="material-icons clickable">report</span></p>
        </div>
    </div>

    <div in:fly class="rect">
        <p>{currentTask.task}</p>

        <div class="answers">
            {#each currentTask.content.split(':')[0].split(',') as answer}
            <div on:click={() => checkAnswer(answer)} class="answer
                 {correctAnswers.includes(answer) ? 'correct' : wrongAnswers.includes(answer) ? 'wrong' : ''}">
                <p>{answer}</p>
            </div>
            {/each}
        </div>

        {#if gotCorrect}
        <div in:slide style="margin-top: 1em;" class="cc-column cc-space">

            <div class="outline">
                <h2>GUT GEMACHT!</h2>

                <div style="margin-top: 0.5em;" class="cc cc-gap">
                    <span on:click={likeButton} class="material-icons clickable {currentTask.liked ? 'selected' : ''}">favorite</span>

                    <span on:click={() => {
                        formOpen.set(true)
                        formTitle.set('Melden')
                    }} class="material-icons clickable">report</span>
                    <span on:click={() => goto('/app/topic/' + currentTask.topic + "/tasks")} class="material-icons clickable">arrow_forward</span>
                </div>
            </div>
        </div>
        {/if}

        <button on:click={() => showSolution = true}>Lösung anzeigen</button>
    </div>

    {#if showSolution}
    <div in:slide class="rect">

        <h4 style="margin-top: 0.3em;">Lösung</h4>
        <p style="margin-top: 0.4em;">{currentTask.explanation}</p>

        <div style="margin-top: 0.5em;" class="tools cc-gap">
            <span on:click={likeButton} class="material-icons clickable {currentTask.liked ? 'selected' : ''}">favorite</span>

            <span class="material-icons clickable" on:click={() => {
                formOpen.set(true)
                formTitle.set('Melden')
            }}>report</span>            
            
            <span on:click={() => goto('/app/topic/' + currentTask.topic + "/tasks")} class="material-icons clickable">arrow_forward</span>
        </div>
    </div>
    {/if}
    
    {/if}
</div>

<style lang="scss">

    .panel {
        position: relative;
        width: 95%;
        max-width: 1400px;
        height: calc(100vh - 3.8em);
        overflow-x: scroll;
        -ms-overflow-style: none;
        scrollbar-width: none;
    }

    .panel::-webkit-scrollbar {
        display: none;
    }

    .rect {
        padding: 0.5em 1em;
        border-radius: 0.5em;
        margin-top: 1em;
        background-color: var(--menu-color);
    }

    span {
        user-select: none;
    }

    .tools {
        display: flex;
        align-items: center;
    }

    .clickable {
        cursor: pointer;
        padding: 0.3em;
        border-radius: 1em;

        &:hover {
            background-color: var(--hover-color);
            color: var(--highlight-color);
        }
    }

    .colored {
        color: var(--highlight-color);
    }

    .selected {
        background-color: var(--selected-color);
        color: var(--highlight-color);

        &:hover {
            background-color: var(--selected-color);
            color: var(--highlight-color);
        }
    }

    .answer {
        text-align: center;
        width: max-content;
        font-size: 18px;
        cursor: pointer;
        margin: 0.2em;
        padding: 0.6em 1.2em;
        border-radius: 0.5em;
        background-color: var(--box-color);

        &:hover {
            background-color: var(--hover-color);
        }
    }

    .correct {
        background-color: green;

        &:hover {
            background-color: green;
        }
    }

    .wrong {
        background-color: red;

        &:hover {
            background-color: red;
        }
    }

    .answers {
        display: flex;
        flex-direction: column;
    }

    button {
        background-color: var(--box-color);

        &:hover {
            background-color: var(--hover-color);
        }
    }

    .outline {
        background-color: var(--box-color);
        padding: 1.3em;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        border-radius: 1em;
    }

</style>