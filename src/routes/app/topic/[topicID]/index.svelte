<script lang="ts">
import { page } from '$app/stores'
import { likeCache, likePost, unlikePost } from '$lib/posts/likes';
import { loadPosts, postList, createPost, addForm, currentPage, uploading, uploadStatus } from '$lib/posts/posts';
import { onMount } from 'svelte';
import { fly, scale } from "svelte/transition"
import "$lib/styles/components.scss"
import "$lib/styles/tooltip.scss"
import "$lib/styles/align.scss"
import "$lib/styles/form.scss"
import { goto } from '$app/navigation';
import { formOpen, formTitle, requesting, requestURL } from '$lib/configuration';
import BetterTextarea from '$lib/components/text/betterTextarea.svelte';
import { selectionResult, selectionType } from '$lib/components/selector/selectorStore';
import { onDestroy } from 'svelte';
import { showNotification } from '$lib/components/notificationStore';
import { uploadDone, uploadedImage, uploadFailed, uploadPicture } from '$lib/posts/images';
import AdvancedTextRender from '$lib/render/advancedTextRender.svelte';

onMount(() => init())

let filter = 0
let query = ''
let content: string = '', title: string = ''

let images: any[] = []

let unsub: any = () => {}

function init() {

    if(!$page.params.topicID) {
        return
    }

    if (!parseInt($page.params.topicID)) {
        return
    }

    loadPosts(query, filter, parseInt($page.params.topicID), $currentPage)

    unsub = selectionResult.subscribe(() => {
        if($selectionResult == undefined) return

        if(images.includes($selectionResult)) {
            showNotification('Diese Datei hast du bereits hochgeladen!', 'red', 5000)
            selectionResult.set(undefined)
            return
        }

        if(images[0]) {
            images.push($selectionResult)
            images = images
        } else images = [$selectionResult]

        selectionResult.set(undefined)
    })
}

let currentImage = 0

function submitPost() {

    let img: any[] = []
    content.split('\n').forEach(s => {
        if(s.startsWith('@image:')) {

            images.forEach(image => {
                
                if(s.split(':')[1] == images.indexOf(image) + '') {
                    if(img[0] != undefined) img.push(image)
                    else img = [image]
                }

            })

        }
    })

    if(!checkArray(img, images)) {
        showNotification('Es wurden nicht alle Bilder eingebunden!', 'red', 2000)
        return
    }
    
    if(img.length > 0) {
        uploading.set(true)

        // Upload first image
        nextImage()

        const done = uploadDone.subscribe(() => {
            if(!$uploadDone) return

            // Add image id
            content = content.replace('@image:' + currentImage, '@image:' + $uploadedImage)

            // Check if there is another image
            if(images.length > 0) {

                nextImage()
            } else {

                // Submit post
                createPost(parseInt($page.params.topicID), title, content, false)

                uploadStatus.set('Der Beitrag wurde erfolgreich veröffentlicht!')

                end(done, failed)
            }

        })

        const failed = uploadFailed.subscribe(() => {
            if(!$uploadFailed) return

            uploadStatus.set('Das Hochladen ist fehlgeschlagen!')

            end(done, failed)
        })

    } else {
        createPost(parseInt($page.params.topicID), title, content, true)
    }
    
}

function reset() {
    images = []
    content = ''
    title = ''
}

function end(done: any, failed: any) {
    setTimeout(() => {

        // Unsubscribe from stores
        done()
        failed()

        // Close form
        addForm.set(false)
        reset()
        uploading.set(false)
    }, 5000);
}

function nextImage() {
    uploadDone.set(false)
    uploadFailed.set(false)
    uploadPicture(images[currentImage])
    images.splice(currentImage, 1)
}

function checkArray(array1: any[], array2: any[]) {
  if (array1.length === array2.length) {
    return array1.every((element, index) => {
      if (element === array2[index]) {
        return true;
      }

      return false;
    });
  }

  return false;
}

function nextPage() {
    if($requesting) return
    loadPosts(query, filter, parseInt($page.params.topicID), $currentPage + 1)
}

function previousPage() {
    if($requesting) return
    loadPosts(query, filter, parseInt($page.params.topicID), $currentPage - 1)
}

function likeButton(post: any) {
    if($requesting) return

    if(likeCache.has(post.id) ? likeCache.get(post.id) : post.liked) {
        changeLikeState(post, false)

        unlikePost(post, () => {
            changeLikeState(post, likeCache.get(post.id))
        })
    } else {
        changeLikeState(post, true)

        likePost(post, () => {
            changeLikeState(post, likeCache.get(post.id))
        })
    }

}

onDestroy(() => unsub)

function changeLikeState(post: any, state: boolean | undefined) {

    let newArray: any[] = $postList

    newArray.forEach(element => {

        if(element.id === post.id && element.liked !== state) {
            element.liked = state

            if(state) {
                element.likes++
            } else element.likes--

        }

    })

    postList.set(newArray)

}

function updateFilter(newFilter: number) {
    filter = newFilter
    loadPosts(query, filter, parseInt($page.params.topicID), $currentPage)
}

function updateQuery() {
    loadPosts(query, filter, parseInt($page.params.topicID), $currentPage)
}

</script>

{#if $addForm}
<div in:scale out:scale class="center-form">

    {#if !$uploading}
    <div class="form">
        <p>Beitrag erstellen</p>

        <input bind:value={title} type="title" placeholder="Titel">
        <BetterTextarea bind:value={content} placeholder="Text"/>

        <span class="material-icons clickable" on:click={() => {
            // Open image selection
            formOpen.set(true)
            formTitle.set('Auswählen')
            selectionType.set('imagedd')
        }}>image</span>

        {#if images[0]}
        <div class="flex flex-wrap cc-space">
            {#each images as image}
            <div class="image cc-biggap">
                <div class="row cc-gap">
                    <span class="material-icons colored">image</span>
                    <p>{image.name} ({images.indexOf(image)})</p>
                </div>
        
                <span class="material-icons" on:click={() => {
                    images.splice(images.indexOf(image), 1)
                    images = images
                }}>close</span>
            </div>
            {/each}

        </div>

        <p style="color: var(--hidden-text-color);">Benutze um ein Bild anzuzeigen @image: und danach
            die Nummer in den Klammern. Das Bild wird erst im veröffentlichen Beitrag angezeigt.
            (Der Text dafür muss am Anfang einer Zeile sein)</p>
        {/if}

        <div class="row">
            <button on:click={submitPost} style="margin-top: 20px;">Erstellen</button>
            <button on:click={() => addForm.set(false)}>Zurück</button>
        </div>
    </div>

    {:else}

    <div class="form small-form">

        {#if $uploadStatus === ''}

        <div class="cc">
            <span style="font-size: 80px;" class="material-icons loading">hourglass_empty</span>
        </div>

        {:else}

        <div class="cc">
            <span style="font-size: 80px; color: lightgreen;" class="material-icons">done_all</span>
        </div>

        {/if}

        <h4>{$uploadStatus}</h4>
        <p style="color: var(--hidden-text-color);">Bitte verlasse diese Seite nicht!</p>
    </div>

    {/if}
</div>
{/if}

<div in:fly={{x: 600, duration: 200, delay: 250}} out:fly={{x: -600, duration: 200}} class="panel">
    
    {#if $requesting && $requestURL.includes('post') && !$addForm}
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

    <div class="container" style="margin-top: 0.4em;">
        <div class="row">
            <input bind:value={query} on:input={updateQuery} placeholder="Beiträge suchen" class="scale">

            <div class="difficulty b-tooltip" style="margin-top: 0.65em;" data-ttext="Beiträge ordnen">
                <p class="diff-selector" on:click={() => updateFilter(1)} style="background-color: {filter == 1 ? 'var(--selector-highlight-color)' : 'var(--hover-color)'};">NEUSTE</p>
                <p class="diff-selector" on:click={() => updateFilter(0)} style="background-color: {filter == 0 ? 'var(--selector-highlight-color)' : 'var(--hover-color)'};">BESTE BEWERTUNG</p>
            </div>
        </div>
    </div>

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
            <div class="row">
                <p on:click={() => goto('/app/post/' + post.id)} class="info">{post.creatorName}</p>
                <p on:click={() => goto('/app/post/' + post.id)} class="info">{post.date}</p>
            </div>
            <h2 on:click={() => goto('/app/post/' + post.id)}>{post.title}</h2>
            <div on:click={() => goto('/app/post/' + post.id)} class="content">
            <AdvancedTextRender text={post.content} />
            </div>
    
            <div class="postbar">
                <span on:click={() => likeButton(post)} class="material-icons {post.liked ? 'selected' : ''}">
                    favorite
                </span>
                <p class="like-text {post.liked ? 'selected' : ''}">{parseInt(post.likes)}</p>

                {#if post.created}
                <span class="material-icons">delete</span>
                {/if}
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

    .clickable {
        padding: 0.3em;
        border-radius: 1em;
        width: max-content;
        cursor: pointer;

        &:hover {
            background-color: var(--hover-color);
            color: var(--highlight-color);
        }
    }

    .postbar {
        padding: 0.3em;
        margin-top: 10px;
        display: flex;
        align-items: center;
        gap: 0.3em;
        border-radius: 0.8em;
        user-select: none;
        transition: 250ms ease;
        transform: scale(1);
        width: min-content;
        background-color: var(--box-color);
        opacity: 1;

        span {
            height: max-content;
            font-size: 22px;
            padding: 0.3em;
            border-radius: 2em;
            transition: 250ms ease;
            cursor: pointer;
            display: flex;
            gap: 0.2em;
            align-items: center;
            justify-content: center;
            transition: 250ms ease; 
            transform: scale(1.0);

            &:hover {
                background-color: var(--hover-color);
            }
        }

        .like-text {
            font-size: 22px;
            margin-right: 10px;
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
        cursor: pointer;
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin: 1.5em;
        padding: 1em;
        border-radius: 1em;
        gap: 0.3em;
        background-color: var(--menu-color);
        transition: 250ms ease;

        .info {
            color: var(--hidden-text-color);
            font-size: 15px;
        }

        &:hover {
            transform: translate(-5px, -5px);
            box-shadow: 10px 10px 0px var(--box-color);
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

    .image {
        width: max-content;
        padding: 0.6em;
        border-radius: 0.5em;
        background-color: var(--menu-color);

        display: flex;
        align-items: center;

        span:hover {
            cursor: pointer;
            color: var(--highlight-color);
        }
    }

    span {
        user-select: none;
    }

</style>