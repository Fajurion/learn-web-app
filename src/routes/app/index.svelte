<script lang="ts">
import { goto } from "$app/navigation";

    import { fly } from "svelte/transition"
    import { onMount } from "svelte";
import { basePath, getToken } from "$lib/configuration";
import { showNotification } from "$lib/components/notificationStore";
import "$lib/styles/components.scss"

    let groupList: any[] = [], testList: any[]

    onMount(() => {

        fetch(basePath + '/api/start', {
            method: 'post',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                token: getToken()
            })
        }).then(async res => {

            if(res.ok) {
                const json = await res.json()
                console.log(json)

                if(!json.success) {
                    
                    switch(json.message) {
                        case 'server.error':
                            showNotification('Es gab einen Fehler auf dem Server. Bitte kontaktiere einen Administrator!', 'red', 2000)
                            break

                        case 'session.expired.deleted':
                        case 'session.expired':
                            showNotification('Deine Sitzung ist abgelaufen!', 'red', 2000)
                            break
                    }

                    return
                }

                groupList = json.groups

            } else {
                showNotification('Der Server ist gerade offline! Bitte versuche es später nochmal.', 'red', 5000)
            }

        }).catch(() => showNotification('Der Server ist gerade offline! Bitte versuche es später nochmal.', 'red', 5000))

    })

</script>

<div out:fly={{x: -500, duration: 250}} in:fly={{x: 500, duration: 250, delay: 250}} class="panel">
    <div class="center">
        <h1><span style="font-size: 50px;" class="material-icons">school</span>Learn</h1>
    </div>

    <div class="container">
        <div class="titlebar">
            <h2>Klassenarbeiten</h2>
            <span style="transform: rotate(180deg);" class="material-icons">arrow_back</span>
        </div>

        <div class="horizontal">
            <div class="element">
                <span style="font-size: 100px;" class="material-icons">menu_book</span>
                <p>3. Mathe KA</p>
            </div>
        </div>
    </div>

    {#if groupList[0]}
    <div class="container">
        <div class="titlebar">
            <h2>Gruppen</h2>
            <span on:click={() => goto('/app/groups')} style="transform: rotate(180deg);" class="material-icons">arrow_back</span>
        </div>

        <div class="horizontal">
            {#each groupList as group}
            <div on:click={() => goto('/app/groups/' + group.id)} class="element">
                <span style="font-size: 100px;" class="material-icons">group</span>
                <p>{group.name}</p>
            </div>
            {/each}
        </div>
    </div>
    {/if}

    <div class="container">
        <h2>Neu bei Learn?</h2>

        <div class="horizontal">
            <div on:click={() => goto('/app/groups')} class="element">
                <span style="font-size: 100px;" class="material-icons">group_add</span>
                <p>Gruppe finden</p>
            </div>

            <div on:click={() => goto('/app/guides')} class="element">
                <span style="font-size: 100px;" class="material-icons">quiz</span>
                <p>Hilfe</p>
            </div>
        </div>
    </div>
</div>

<style lang="scss">

    .panel {
        width: 95%;
        padding: 0.5em;
        max-width: 1400px;
        height: calc(100vh - 3.8em);
        overflow-x: scroll;
        -ms-overflow-style: none;
        scrollbar-width: none;
    }

    .panel::-webkit-scrollbar {
        display: none;
    }

    .center {
        width: 100%;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
    }

    h1 {
        display: flex;
        align-items: center;
        gap: 0.3em;
        margin: 1em 2em;

        span {
            color: var(--highlight-color);
        }
    }

    .titlebar {
        display: flex;
        width: 100%;
        align-items: center;
        gap: 0.7em;

        span {
            padding: 0.2em;
            background-color: var(--box-color);
            border-radius: 1em;
            transition: 250ms ease;
            cursor: pointer;

            &:hover {
                color: var(--highlight-color);
            }
        }
    }

</style>