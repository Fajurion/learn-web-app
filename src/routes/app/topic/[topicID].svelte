<script lang="ts">
import { page } from '$app/stores'
import Textarea from '$lib/components/textarea.svelte';
import Postbar from '$lib/nav/postbar.svelte';
import { loadPosts, postList, requesting, createPost, addForm, likePost, reloadPage, currentPage } from '$lib/posts/posts';
import { onMount } from 'svelte';
import { fly, scale } from "svelte/transition"

onMount(() => init())

let content: string = '', title: string = ''

function init() {

    if(!$page.params.topicID) {
        return
    }

    if (!parseInt($page.params.topicID)) {
        return
    }

    loadPosts(parseInt($page.params.topicID), 0)
}

function submitPost() {
    
    if(createPost(parseInt($page.params.topicID), title, content)) {
        addForm.set(false)
        reloadPage()
    }

}

function nextPage() {
    if($requesting) return
    loadPosts(parseInt($page.params.topicID), $currentPage + 1)

}

function previousPage() {
    if($requesting) return
    loadPosts(parseInt($page.params.topicID), $currentPage - 1)
}

</script>

<Postbar />

{#if $addForm}

<div in:scale out:scale class="center-form">
    <div class="form">
        <p>Beitrag erstellen</p>

        <input bind:value={title} type="title" placeholder="Titel">
        <Textarea bind:value={content} placeholder="Text"/>

        <button on:click={submitPost} style="margin-top: 20px;">Erstellen</button>
        <button on:click={() => addForm.set(false)}>Zurück</button>
    </div>
</div>

{/if}

<div in:scale out:fly={{x: -100, duration: 200}} class="panel">
    
    {#if $requesting && !$addForm}
    <div class="center">
        <span style="font-size: 100px;" class="material-icons loading">hourglass_empty</span>
    </div>
    {/if}
    
    {#if !$postList[0] && !$requesting && !$addForm}
    <div in:fly class="center">
        <h2>Keine Beiträge gefunden!</h2>
        <div class="toolbar">
            <span on:click={init} class="material-icons">refresh</span>
            <span on:click={() => addForm.set(true)} class="material-icons">add</span>
        </div>
    </div>
    {/if}

    <div class="scrollable">

        {#if !($currentPage == 0 && $postList.length < 7)}
        <div class="pagebar" style="margin-top: 5px;">
            <span on:click={previousPage} class="material-icons {$currentPage == 0 ? 'hidden' : ''}">arrow_back</span>
            <p>Seite {$currentPage + 1}</p>
            <span on:click={nextPage} class="material-icons {$postList.length < 7 ? 'hidden' : ''}" style="transform: rotate(180deg);">arrow_back</span>
        </div>
        {/if}

        {#each $postList as post}
    
        <div class="post">
            <p class="info">erstellt am {post.date}</p>
            <h2>{post.title}</h2>
            {#each post.content.split('\n') as line}
                <p>{line} <br></p>
            {/each}
    
            <div class="postbar">
                <span on:click={() => likePost(post.id)} class="material-icons {post.liked ? 'selected' : ''}">favorite<p>{post.likes + (post.liked ? 1 : 0)}</p></span>
                <span class="material-icons">comment</span>
            </div>
        </div>
        
        {/each}

        {#if !($currentPage == 0 && $postList.length < 7)}
        <div class="pagebar" style="margin-top: 5px;">
            <span on:click={previousPage} class="material-icons {$currentPage == 0 ? 'hidden' : ''}">arrow_back</span>
            <p>Seite {$currentPage + 1}</p>
            <span on:click={nextPage} class="material-icons {$postList.length < 7 ? 'hidden' : ''}" style="transform: rotate(180deg);">arrow_back</span>
        </div>
        {/if}

        <div class="spacer"></div>

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

    .spacer {
        height: 5em;
    }

    .hidden {
        opacity: 0;
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


    .postbar {
        margin-top: 10px;
        display: flex;
        gap: 0.3em;
        user-select: none;
        transition: 250ms ease;
        transform: scale(1);
        opacity: 1;

        span {
            font-size: 22px;
            padding: 0.4em;
            background-color: var(--box-color);
            border-radius: 0.5em;
            transition: 250ms ease;
            cursor: pointer;
            display: flex;
            gap: 0.2em;
            align-items: center;
            justify-content: center;
            transition: 250ms ease; 
            transform: scale(1.0);

            &:hover {
                transform: scale(1.15);
            }
        }

        .selected {
            color: var(--highlight-color);
        }
    }

    input {
        height: 1em;
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

    .loading {
        user-select: none;
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

    .post {
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin: 1.5em;
        padding: 1em;
        border-radius: 1em;
        gap: 0.3em;
        background-color: var(--menu-color);

        .info {
            color: var(--hidden-text-color);
            font-size: 15px;
        }
    }

    .pagebar {
        display: flex;
        justify-content: space-between;
        gap: 0.3em;
        user-select: none;
        transition: 250ms ease;
        transform: scale(1);
        opacity: 1;
        align-items: center;

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

        p {
            font-size: 20px;
            font-weight: bold;
        }
    }

</style>