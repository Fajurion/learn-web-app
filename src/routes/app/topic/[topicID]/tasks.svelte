<script lang="ts">
import { scale, fly } from "svelte/transition";
import { currentTopic } from "$lib/sidebar/topics";
import { onMount } from "svelte";
import { addForm } from '$lib/posts/posts';
import Textarea from "$lib/components/textarea.svelte";
import { createTask, listTasks, resetTasks, taskArray, taskFilterSorting, taskFilterDifficulty, taskSearchQuery, taskOffset } from "$lib/tasks/tasks";
import { page } from "$app/stores";
import "$lib/styles/components.scss"
import "$lib/styles/tooltip.scss"
import "$lib/styles/form.scss"
import "$lib/styles/align.scss"
import { requesting, requestURL } from '$lib/configuration';
import { goto } from "$app/navigation";
import NotFound from "$lib/render/notFound.svelte";

    let difficulty = 0
    let answers: string[] = ['Antwort 1']
    let title = '', task = '', explanation = '', correct = ''

    function addAnswer() {
        answers = answers.concat('')
    }

    function removeAnswer(answer: string) {
        const index = answers.indexOf(answer);
        answers =  [...answers.slice(0, index), ...answers.slice(index+1)];
    }

    function taskCreation() {
         createTask($currentTopic.id, difficulty, title, explanation, answers, correct, task)
    }

    function loadTasks() {

        listTasks($taskArray, $taskOffset, $taskSearchQuery, $taskFilterDifficulty, $taskFilterSorting, $page.params.topicID)
    }

    function updateFilter(query: string, newFilter: number, newSorting: number) {
        $taskOffset = 0
        $taskArray = []

        $taskSearchQuery = query
        $taskFilterDifficulty = newFilter
        $taskFilterSorting = newSorting

        loadTasks()
    }

    onMount(() => {
        resetTasks()
        loadTasks()
    })

</script>

{#if $addForm}
<div in:scale out:scale class="center-form">
    <div class="form">
        <div class="content">
            <div class="difficulty">
                <p>Titel erstellen</p>
                <p style="color: {title.length > 3 && title.length < 50 ? 'white' : 'red'};">{title.length + ' / 50'}</p>
            </div>
            <input bind:value={title} type="title" placeholder="Titel">

            <p style="margin-top: 10px;">Schwierigkeit auswählen</p>
            <div class="difficulty">
                <p class="diff-selector" on:click={() => difficulty = 0}
                    style="background-color: {difficulty == 0 ? 'green' : 'var(--hover-color)'};">EINFACH</p>
                <p class="diff-selector" on:click={() => difficulty = 1}
                    style="background-color: {difficulty == 1 ? 'orange' : 'var(--hover-color)'};">MITTEL</p>
                <p class="diff-selector" on:click={() => difficulty = 2}
                    style="background-color: {difficulty == 2 ? 'red' : 'var(--hover-color)'};">SCHWER</p>
            </div>

            <div style="margin-top: 10px;" class="difficulty">
                <p>Aufgabenstellung erstellen</p>
                <p style="color: {task.length > 3 && task.length < 200 ? 'white' : 'red'};">{task.length + ' / 200'}</p>
            </div>
            <Textarea id="vater" bind:value={task} placeholder="Aufgabe"/>

            <p style="margin-top: 10px;">Antwortmöglichkeiten erstellen</p>
            <div class="answers">
                {#each answers as answer}

                <div class="answer">
                    <input bind:value={answer}>
                    <span class="material-icons clickable" on:click={() => removeAnswer(answer)}>delete</span>
                    <span class="material-icons clickable" on:click={() => correct = answer}>done_all</span>
                </div>

                {/each}
                <span class="material-icons clickable" on:click={addAnswer}>add</span>
                <input bind:value={correct} placeholder="Richtige Antwort">
            </div>

            <div style="margin-top: 10px;" class="difficulty">
                <p>Erklärung erstellen</p>
                <p style="color: {explanation.length > 3 && explanation.length < 512 ? 'white' : 'red'};">{explanation.length + ' / 512'}</p>
            </div>
            <Textarea id="mutter" bind:value={explanation} placeholder="Erklärung"/>

            <div class="row">
                <button on:click={taskCreation} style="margin-top: 20px;">Erstellen</button>
                <button on:click={() => addForm.set(false)}>Zurück</button>
            </div>
        </div>
    </div>
</div>
{/if}

<div class="panel">

    <div class="container" style="margin-top: 0.4em;">
        <div class="row flex-wrap mobile-center-column">
            <input bind:value={$taskSearchQuery} on:input={() => updateFilter($taskSearchQuery, $taskFilterDifficulty, $taskFilterSorting)}
             placeholder="Aufgaben suchen" class="scale">

            <div class="cc-column">
                <div class="difficulty b-tooltip" style="margin-top: 0.65em;" data-ttext="Sortieren nach Schwierigkeiten">
                    <p class="diff-selector" on:click={() => updateFilter($taskSearchQuery, -1, $taskFilterSorting)} 
                        style="background-color: {$taskFilterDifficulty == -1 ? 'var(--selector-highlight-color)' : 'var(--hover-color)'};">ALLE</p>
                    <p class="diff-selector" on:click={() => updateFilter($taskSearchQuery, 0, $taskFilterSorting)} 
                        style="background-color: {$taskFilterDifficulty == 0 ? 'green' : 'var(--hover-color)'};">EINFACH</p>
                    <p class="diff-selector" on:click={() => updateFilter($taskSearchQuery, 1, $taskFilterSorting)} 
                        style="background-color: {$taskFilterDifficulty == 1 ? 'orange' : 'var(--hover-color)'};">MITTEL</p>
                    <p class="diff-selector" on:click={() => updateFilter($taskSearchQuery, 2, $taskFilterSorting)} 
                        style="background-color: {$taskFilterDifficulty == 2 ? 'red' : 'var(--hover-color)'};">SCHWER</p>
                </div>
                <div class="difficulty b-tooltip" style="margin-top: 0.65em;" data-ttext="Sortierung ändern">
                    <p class="diff-selector" on:click={() => updateFilter($taskSearchQuery, $taskFilterDifficulty, 0)} 
                        style="background-color: {$taskFilterSorting == 0 ? 'var(--selector-highlight-color)' : 'var(--hover-color)'};">BESTE BEWERTUNG</p>
                    <p class="diff-selector" on:click={() => updateFilter($taskSearchQuery, $taskFilterDifficulty, 1)}
                        style="background-color: {$taskFilterSorting == 1 ? 'var(--selector-highlight-color)' : 'var(--hover-color)'};">NEUSTE</p>
                </div>
            </div>
        </div>
    </div>

    <div class="container" style="margin-bottom: 5em;">
        <div class="vertical">

            {#if !$taskArray[0] && !$requesting}
            <div in:fly class="cc cc-space column">
                <NotFound margin="0em" text="Keine Aufgaben gefunden!" />
                <div class="toolbar">
                    <span on:click={() => updateFilter($taskSearchQuery, $taskFilterDifficulty, $taskFilterSorting)} class="material-icons">refresh</span>
                    <span on:click={() => addForm.set(true)} class="material-icons">add</span>
                </div>
            </div>
            {/if}
            
            {#each $taskArray as task}
            <div on:click={() => goto('/app/tasks/' + task.id)} class="task">
                <div class="description">
                    <span style="font-size: 50px;" class="material-icons colored">task</span>
    
                    <div class="info">
                        <div class="flex cc-space">
                            <p style="background-color: var(--selector-highlight-color);" class="diff">
                                {task.difficulty == 0 ? 'EINFACH' : task.difficulty == 1 ? 'MITTEL' : 'SCHWER'}
                            </p>
        
                            <h3>{task.title}</h3>
                        </div>

                        <p style="color: var(--hidden-text-color);">{task.task}</p>
                    </div>
                </div>

                <span class="material-icons" style="transform: rotate(180deg); padding: 0em 0.6em;">arrow_back</span>
            </div>
            {/each}

            {#if $requesting && $requestURL.includes('task') && !$addForm}
            <div class="cc">
                <span style="font-size: 100px;" class="material-icons loading">hourglass_empty</span>
            </div>
            {/if}

            {#if taskArray.length >= 10}
            <button on:click={loadTasks}>Mehr anzeigen</button>
            {/if}
        </div>
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

    input {
        resize: none;
        outline: none;
        border: none;
        font-size: 18px;
        padding: 0.5em 0.6em;
        border-radius: 0.3em;
        background-color: var(--menu-color);
        color: var(--text-color);
        transition: 250ms ease;
    }

    button {
        text-decoration: none;
        outline: none;
        border: none;
        font-size: 18px;
        padding: 0.5em 1em;
        border-radius: 0.3em;
        background-color: var(--menu-color);
        color: var(--text-color); 
        transition: 250ms ease;
        cursor: pointer;

        &:hover {
            background-color: var(--hover-color);
        }
    }

    .difficulty {
        display: flex;
        align-items: center;
        gap: 0.5em;

        .diff-selector {
            padding: 0.3em 0.9em;
            border-radius: 1em;
            transition: 250ms ease;
            cursor: pointer;
            user-select: none;
        }
    }

    .answers {
        display: flex;
        gap: 0.5em;
        flex-direction: column;

        .answer {
            display: flex;
            gap: 0.3em;
        }
    }

    .diff {
        width: max-content;
        padding: 0.3em 0.9em;
        border-radius: 1em;
        user-select: none;
    }

    .clickable {
        border-radius: 1em;
        width: max-content;
        padding: 0.3em;
        background-color: var(--menu-color);
        cursor: pointer;
        transition: 250ms ease;

        &:hover {
            color: var(--highlight-color);
        }
    }

    .task {
        padding: 0.1em 0.5em;
        border-radius: 1em;
        display: flex;
        align-items: center;
        justify-content: space-between;

        &:hover {
            background-color: var(--hover-color);
            cursor: pointer;
        }
    }
    
    .description {
        display: flex;
        padding: 0.3em;
        align-items: center;
        gap: 0.3em;
        user-select: none;
        border-radius: 1em;

        .info {
            display: flex;
            flex-direction: column;
            gap: 0.4em;

            p {
                display: flex;
                align-items: center;
                gap: 0.2em;
            }
        }

        .colored {
            color: var(--highlight-color);
        }

        &:hover {
            background-color: var(--hover-color);
            cursor: pointer;
        }
    }

    .row {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .scale {
        width: 200px;
        max-width: 90%;
        transition: width 250ms ease;
    }

    .scale:focus {
        width: 400px;
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
            padding: 0.4em;
            background-color: var(--box-color);
            border-radius: 1em;
            transition: 250ms ease;
            cursor: pointer;
            display: flex;
            gap: 0.2em;

            &:hover {
                color: var(--highlight-color);
            }
        }
    }

    .center {
        margin-top: 30vh;
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        gap: 0.5em;
        width: 100%;
    }

</style>