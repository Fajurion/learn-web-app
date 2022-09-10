<script lang="ts">
    import { goto } from "$app/navigation";

    import { slide } from "svelte/transition"
    import { onMount } from "svelte";
    import "$lib/styles/components.scss"
    import "$lib/styles/align.scss"
    import "$lib/styles/input.scss"
    import { accountData, groupList, refreshAccount, examList } from "$lib/account/account";
    import { formOpen, formTitle, requesting, requestURL } from "$lib/configuration";
import UnderConstruction from "$lib/render/underConstruction.svelte";

    let questionOpen = ''

    onMount(() => {
        if($requesting) return
        refreshAccount()
    })

    function openQuestion(id: string) {
        questionOpen = questionOpen == id ? '' : id
    }

</script>

<div class="panel">
    <div class="center">
        <h1><span style="font-size: 50px;" class="material-icons">school</span>Learn</h1>
    </div>

    <!--
    <div class="container">
        <h2>Zuletzt besucht</h2>

        <div class="horizontal cc">
            <div class="not-clickable">
                <span style="font-size: 50px;" class="material-icons">cancel</span>
                <p style="margin-top: 10px;">Nichts gefunden</p>
            </div>
        </div>
    </div> -->

    <div class="container">
        <h2>Willkommen, {$accountData.username}</h2>

        <div class="vertical">

            {#if $groupList[0]}
            <p style="color: var(--hidden-text-color);">Willkommen zurück bei Learn. Brauchst du nochmal Hilfe?</p>
            {:else}
            <p style="color: var(--hidden-text-color);">Es sieht so aus als wärst du neu bei Learn! Hier ist ein bisschen Hilfe!</p>
            {/if}

            <div class="flex cc-space flex-wrap">
                <button on:click={() => {
                    // Link yt video
                }}>Video anschauen</button>

                <button on:click={() => {
                    goto('/app/groups')
                }}>Gruppen beitreten</button>
            </div>
        </div>
    </div>

    {#if $groupList[0]}
    <div class="container">
        <div class="titlebar">
            <h2>Gruppen</h2>
            <span on:click={() => goto('/app/groups')} style="transform: rotate(180deg);" class="material-icons">arrow_back</span>
        </div>

        <div class="horizontal vertical-scroll">
            {#each $groupList as group}
            <div on:click={() => goto('/app/groups/' + group.id)} class="element">
                <span style="font-size: 100px;" class="material-icons">group</span>
                <p>{group.name.length > 11 ? group.name.substring(0, 11) + ".." : group.name}</p>
            </div>
            {/each}
        </div>
    </div>
    {/if}

    {#if $examList[0]}
    <div class="container">
        <div class="titlebar">
            <h2>Klassenarbeiten</h2>
            <span on:click={() => goto('/app/exams')} style="transform: rotate(180deg);" class="material-icons">arrow_back</span>
        </div>

        <div class="horizontal vertical-scroll">
            {#each $examList as exam}
            <div on:click={() => goto('/app/exams/' + exam.id)} class="element">
                <span style="font-size: 100px;" class="material-icons">menu_book</span>
                <p>{exam.name.length > 11 ? exam.name.substring(0, 11) + ".." : exam.name}</p>
            </div>
            {/each}
        </div>
    </div>
    {/if}

    <div class="container">
        <h2>Guides</h2>
        
        <div class="question">
            <div on:click={() => openQuestion('324')} class="title">
                <p>Warum kann ich keine Bilder hochladen?</p>
                <span style="font-size: 40px;" class="material-icons {questionOpen != '324' ? 'open' : 'close'}">expand_less</span>
            </div>

            {#if questionOpen == '324'}
            <div class="answer" in:slide out:slide>
                <p>Es kann sein dass du keine Berechtigung zum Bilder hochladen hast. Falls dich das stört spreche darüber bitte mit einem
                    Administrator dieser Plattform, um den Fall zu klären. Wenn du überprüfen willst ob du die Berechtigung hast drücke bitte
                    auf den Knopf unter dieser Antwort und schau ob du dort die Berechtigung "upload.image" steht, wenn nicht kannst du keine
                    Bilder hochladen.
                </p>

                <button on:click={() => {
                    formOpen.set(true)
                    formTitle.set('Berechtigungen')
                }}>Berechtigungen</button>
            </div>
            {/if}
        </div>

        <div class="question">
            <div on:click={() => openQuestion('1')} class="title">
                <p>Wie aktiviere ich Zwei-Faktor Authentifizierung?</p>
                <span style="font-size: 40px;" class="material-icons {questionOpen != '1' ? 'open' : 'close'}">expand_less</span>
            </div>

            {#if questionOpen == '1'}
            <div class="answer" in:slide out:slide>
                <p>Die Zwei-Faktor Authentifizierung kann einmal durch die Einstellungen, die sich rechts oben im Account Menü befinden,
                     oder über den Knopf unter dieser Antwort aktiviert werden.</p>

                <button on:click={() => {
                    formOpen.set(true)
                    formTitle.set('2FA')
                }}>2FA aktivieren</button>
            </div>
            {/if}
        </div>
        
        <div class="question">
            <div on:click={() => openQuestion('2')} class="title">
                <p>Warum sollte ich Zwei-Faktor Authentifizierung aktivieren?</p>
                <span style="font-size: 40px;" class="material-icons {questionOpen != '2' ? 'open' : 'close'}">expand_less</span>
            </div>

            {#if questionOpen == '2'}
            <div class="answer" in:slide out:slide>
                <p>Zwei-Faktor Authentifizierung dient der Sicherheit deines Accounts und vor allem dem der Plattform. Fast alles auf dieser Plattform
                    ist frei für jeden Benutzer zugänglich und wenn somit ein Account gehackt wird, ist der Inhalt der ganzen Plattform für den Hacker
                    freigegeben. Wir bitten euch also Zwei-Faktor Authentifizierung zu aktivieren. Gehe dazu einfach in die Frage über dieser.
                </p>
            </div>
            {/if}
        </div>

        <div class="question">
            <div on:click={() => openQuestion('3')} class="title">
                <p>Wer hat diese Plattform programmiert?</p>
                <span style="font-size: 40px;" class="material-icons {questionOpen != '3' ? 'open' : 'close'}">expand_less</span>
            </div>

            {#if questionOpen == '3'}
            <div class="answer" in:slide out:slide>
                <p>Diese Plattform wird von <a href="https://github.com/Fajurion">Fajurion Open Source</a> entwickelt. Ihr könnt gerne die Administratoren
                     der Plattform fragen, um euch genaueres zu sagen.
                </p>
            </div>
            {/if}
        </div>

        <div class="question">
            <div on:click={() => openQuestion('4')} class="title">
                <p>Wie kann ich bei der Plattform mitwirken?</p>
                <span style="font-size: 40px;" class="material-icons {questionOpen != '3' ? 'open' : 'close'}">expand_less</span>
            </div>

            {#if questionOpen == '4'}
            <div class="answer" in:slide out:slide>
                <p>Jede Spende für die Plattform wäre nett, da wir pro Monat sehr viel Geld für die ganze Infrastruktur der Plattform bezahlen. Für genaueres
                    melde dich einfach bei einem Administrator.
                </p>
            </div>
            {/if}
        </div>

        <div style="margin-top: 3em;">
            <UnderConstruction />
        </div>
    </div>

    <div class="spacer"></div>
</div>

<style lang="scss">

    .spacer {
        margin-bottom: 2em;
    }

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

    .vertical-scroll {
        overflow-x: scroll;
        -ms-overflow-style: none;
        scrollbar-width: none;
        overscroll-behavior-inline: contain;
    }

    .vertical-scroll::-webkit-scrollbar {
        display: none;
    }

    .question {
        margin-top: 10px;
        padding: 0.3em 1em;
        background-color: var(--menu-color);
        border-radius: 0.5em;

        .title {
            user-select: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1em;
        }

        .answer {
            display: flex;
            justify-content: left;
            gap: 0.6em;
            flex-direction: column;
            transition: 250ms ease;
            opacity: 1;
            pointer-events: all;
            overflow: hidden;
            margin-bottom: 5px;
            color: var(--hidden-text-color);
        }

        a {
            text-decoration: none;
            color: var(--highlight-color);
        }
    }

    button {
        width: max-content;
        background-color: var(--box-color);

        &:hover {
            background-color: var(--hover-color);
        }
    }

    .open {
        transition: 250ms ease;
        transform: rotate(180deg);
    }

    .close {
        transition: 250ms ease;
    }

</style>