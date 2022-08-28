<script lang="ts">
import { onMount } from "svelte"
import { page } from "$app/stores"
import { fly, scale, slide } from "svelte/transition"
import { create, createComment, currentPost, loadComments, loadPost } from "$lib/posts/comments";
import "$lib/styles/components.scss"
import "$lib/styles/form.scss"
import Textarea from "$lib/components/textarea.svelte";

    // Variable for value of comment in comment add form
    let comment = ''

    // List of all comments
    let commentsArray: any[] = []

    onMount(() => {
        if(parseInt($page.params.postID)) {

            // Load post
            loadPost(parseInt($page.params.postID))

            // Load comments of post
            loadComments(parseInt($page.params.postID), (comments: any) => {
                commentsArray = comments
            })
        }
    })

    // Creates comment and adds it to list
    function createAction() {
        create(parseInt($page.params.postID), comment, () => {
            commentsArray.push({id: 0, creator: 0, content: comment, creatorName: 'Ich', date: Date.now()})
        })
    }

</script>

<!-- Check if form is open -->
{#if $createComment}

<!-- Form for creating a comment -->
<div in:scale out:scale class="center-form">
    <div class="form">
        <div class="across">
            <p>Kommentieren</p>
            <p style="color: {comment.length < 500 ? 'white' : 'red'};">{comment.length + ' / 500'}</p>
        </div>

        <Textarea bind:value={comment} placeholder="Kommentar"/>

        <button on:click={createAction} style="margin-top: 20px;">Hinzufügen</button>
        <button on:click={() => createComment.set(false)}>Zurück</button>
    </div>
</div>

{/if}

<div in:fly={{x: 600, duration: 200, delay: 250}} out:fly={{x: -600, duration: 200}} class="panel">

    <!-- Check if there isn't any post -->
    {#if !$currentPost.content}
    <h2>Beitrag nicht gefunden!</h2>
    {/if}

    <!-- Check if post even exists -->
    {#if $currentPost.content}

    <!-- Post section -->
    <div class="container spacer">
        <div class="row">
            <div class="title">
                <p class="darker">{$currentPost.creatorName} am {$currentPost.date}</p>
                <h2>{$currentPost.title}</h2>
            </div>


            <div class="toolbar">

                {#if $currentPost.created}
                <span class="material-icons clickable">edit</span>
                {/if}

                {#if $currentPost.created}
                <span class="material-icons clickable">delete</span>
                {/if}

            </div>
        </div>
        
        <div class="vertical">
            {#each $currentPost.content.split('\n') as line}

                {#if line.startsWith('# ')}
                <h3>{line.replace('# ', '')}</h3>

                {:else if line === ' ...'}
                <strong>Klicke auf den Beitrag um mehr zu lesen.</strong>

                {:else}
                <p>{line} <br></p>
                {/if}

            {/each}
        </div>
    </div>

    <!-- Comment section -->
    <div class="container spacer">
        <div class="titlebar">
            <h2>Kommentare</h2>
            <span on:click={() => createComment.set(true)} style="font-size: 30px;" class="material-icons clickable">question_answer</span>
        </div>
    
        {#each commentsArray as comment}
        <div in:slide class="vertical">
            <p class="darker">{comment.creatorName} am {comment.date}</p>
            <p>{comment.content}</p>
        </div>
        {/each}
    </div>

    {/if}
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
        margin-top: 1em;
    }

    .titlebar {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .clickable {
        padding: 0.3em;
        border-radius: 1em;
        transition: 250ms ease;
        cursor: pointer;
        
        &:hover {
            background-color: var(--hover-color);
        }
    }

    .darker {
        color: var(--hidden-text-color);
        background: none;
    }

    .row {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
</style>
