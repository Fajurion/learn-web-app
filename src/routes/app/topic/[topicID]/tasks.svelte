<script lang="ts">
import { showNotification } from "$lib/components/notificationStore";

import { scale, fly } from "svelte/transition";
  
import { basePath, getToken } from "$lib/configuration";
import { currentTopic } from "$lib/sidebar/topics";

import { onMount } from "svelte";
import { addForm } from '$lib/posts/posts';
import Textarea from "$lib/components/textarea.svelte";
import { createTask } from "$lib/tasks/tasks";
import { page } from "$app/stores";
import "$lib/styles/components.scss"
import "$lib/styles/tooltip.scss"

    let difficulty = 0, filterDifficulty = -1
    let answers: string[] = ['Antwort 1']
    let title = '', task = '', explanation = '', correct = ''

    let taskArray: any[] = [];

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
        fetch(basePath + '/api/task/list', {
            method: 'post',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                token: getToken(),
                topic: $page.params.topicID,
                limit: 10,
                offset: 0
            })
        }).then(async res => {

            if(res.ok) {
                const json = await res.json()
                console.log(json)

                if(json.success) {

                    if(json.tasks[0]) {
                        if(taskArray[0]) {
                            taskArray = taskArray.concat(json.tasks)
                        } else taskArray = json.tasks
                    }

                } else {
                    showNotification('Deine Sitzung ist abgelaufen!', 'red', 2000)
                }

            } else {
                showNotification('Der Server ist gerade offline. Bitte versuche es später nochmal!', 'red', 2000)
            }

        }).catch(() => showNotification('Der Server ist gerade offline. Bitte versuche es später nochmal!', 'red', 2000))
    }

    onMount(() => {
        loadTasks()
    })

</script>

{#if $addForm}
<div in:scale out:scale class="center-form">
    <div class="form">
        <div class="difficulty">
            <p>Titel erstellen</p>
            <p style="color: {title.length > 3 && title.length < 50 ? 'white' : 'red'};">{title.length + ' / 50'}</p>
        </div>
        <input bind:value={title} type="title" placeholder="Titel">

        <p style="margin-top: 10px;">Schwierigkeit auswählen</p>
        <div class="difficulty">
            <p class="diff-selector" on:click={() => difficulty = 0} style="background-color: {difficulty == 0 ? 'green' : 'var(--hover-color)'};">EINFACH</p>
            <p class="diff-selector" on:click={() => difficulty = 1} style="background-color: {difficulty == 1 ? 'orange' : 'var(--hover-color)'};">MITTEL</p>
            <p class="diff-selector" on:click={() => difficulty = 2} style="background-color: {difficulty == 2 ? 'red' : 'var(--hover-color)'};">SCHWER</p>
        </div>

        <div style="margin-top: 10px;" class="difficulty">
            <p>Aufgabenstellung erstellen</p>
            <p style="color: {task.length > 3 && task.length < 200 ? 'white' : 'red'};">{task.length + ' / 200'}</p>
        </div>
        <Textarea bind:value={task} placeholder="Aufgabe"/>

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
        <Textarea bind:value={explanation} placeholder="Erklärung"/>

        <button on:click={taskCreation} style="margin-top: 20px;">Erstellen</button>
        <button on:click={() => addForm.set(false)}>Zurück</button>
    </div>
</div>
{/if}

<div in:fly={{x: 600, duration: 200, delay: 250}} out:fly={{x: -600, duration: 200}} class="panel">

    <div class="container" style="margin-top: 0.4em;">
        <div class="row">
            <input placeholder="Aufgaben suchen" class="scale">

            <div class="difficulty b-tooltip" style="margin-top: 0.65em;" data-ttext="Sortieren nach Schwierigkeiten">
                <p class="diff-selector" on:click={() => filterDifficulty = -1} style="background-color: {filterDifficulty == -1 ? 'var(--selector-highlight-color)' : 'var(--hover-color)'};">ALLE</p>
                <p class="diff-selector" on:click={() => filterDifficulty = 0} style="background-color: {filterDifficulty == 0 ? 'green' : 'var(--hover-color)'};">EINFACH</p>
                <p class="diff-selector" on:click={() => filterDifficulty = 1} style="background-color: {filterDifficulty == 1 ? 'orange' : 'var(--hover-color)'};">MITTEL</p>
                <p class="diff-selector" on:click={() => filterDifficulty = 2} style="background-color: {filterDifficulty == 2 ? 'red' : 'var(--hover-color)'};">SCHWER</p>
            </div>
        </div>
    </div>

    <div class="container">
        <div class="vertical">
            {#each taskArray as task}

            <div class="task">
                <span style="font-size: 50px;" class="material-icons colored">task</span>

                <div class="info">
                    <div style="display: flex; align-items: center; gap: 0.3em;">
                        <p style="background-color: {task.difficulty == 0 ? 'green' : task.difficulty == 1 ? 'orange' : 'red'};" class="diff">
                            {task.difficulty == 0 ? 'EINFACH' : task.difficulty == 1 ? 'MITTEL' : 'SCHWER'}
                        </p>
                    </div>

                    <h3>{task.title}</h3>
                </div>
            </div>
        
            {/each}
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

    .center-form {
        z-index: 1;
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        gap: 0.5em;
        width: 100%;
        height: 100%;
    }

    .form {
        display: flex;
        justify-content: center;
        padding: 2em;
        border-radius: 1em;
        background-color: var(--box-color);
        flex-direction: column;
        width: 1000px;
        max-width: 85%;
        gap: 0.5em;
        overflow-y: scroll;
        -ms-overflow-style: none;
        scrollbar-width: none;
    }

    .form::-webkit-scrollbar {
        display: none;
    }

    input {
        overflow: hidden;
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

    .clickable-list {
        color: white;
        border-radius: 1em;
        width: max-content;
        padding: 0.3em;
        background-color: var(--box-color);
        cursor: pointer;
        transition: 250ms ease;

        &:hover {
            color: var(--highlight-color);
        }
    }
    
    .task {
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
        width: 100%;
        max-width: 200px;
        transition: max-width 250ms ease;
    }

    .scale:focus {
        max-width: 400px;
    }

</style>