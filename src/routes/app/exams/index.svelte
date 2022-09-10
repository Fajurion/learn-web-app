<script lang="ts">

    import "$lib/styles/components.scss"
    import "$lib/styles/align.scss"
    import "$lib/styles/input.scss"
    import "$lib/styles/form.scss"
    
    import { getToken, postRequest, requesting, requestURL } from "$lib/configuration";
    import { customFormat } from "$lib/posts/posts";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    
    let offset = 0, currentCount = 0
    let button = false

    let examMap = new Map<string, any>()
    
    onMount(() => {
        refresh()
    })

    function refresh() {
        if($requesting && $requestURL.includes('exam')) return
        offset = 0
        loadMore()
    }
    
    function loadMore() {
        if($requesting && $requestURL.includes('exam')) return
    
        postRequest('/api/exam/list', {
            token: getToken(),
            offset: offset
        }, (json: any) => {
            if(!json.success) return
    
            // Add dates
            json.exams.forEach((element: any) => {
                element.date = customFormat(new Date(element.date), "#DD#.#MM#.#YYYY#")
            });
    
            // Set values
            currentCount += json.exams.length
            const map = examMap
    
            json.exams.forEach((element: any) => {
    
                if(map.has(element.date)) {
                    map.get(element.date).push(element)
                } else {
                    map.set(element.date, [element])
                }
    
            })
            examMap = examMap

            offset += 20;

            button = currentCount >= offset
        })
    
    }
    
</script>

<div class="panel">
    <div style="margin-top: 1em;" class="container">
        <div class="row">
            <div class="row cc-space">
                <span style="font-size: 30px;" class="material-icons colored">menu_book</span>
                <h2>Klassenarbeiten</h2>
            </div>
    
            <div class="flex cc-space">
    
                <span on:click={refresh} style="font-size: 27px;"
                    class="material-icons clickable">refresh</span>
    
            </div>
        </div>
    
        <div class="spacer">
    
        </div>
    
        {#if examMap.size != 0}
    
        {#each Array.from(examMap.keys()) as date}
    
        <h3>{date}</h3>
    
        {#each examMap.get(date) as exam}
    
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
    
        {#if button}
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
        margin-bottom: 20px;
    }

    .clickable {
        padding: 0.3em;
        border-radius: 1em;
        transition: 250ms ease;
        cursor: pointer;
        user-select: none;

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

    .colored {
        color: var(--highlight-color);
    }

    .hidden {
        color: var(--hidden-text-color);
    }

</style>