<script lang="ts">
import { goto } from "$app/navigation";

    import { fly } from "svelte/transition"

</script>

<div out:fly={{x: -500, duration: 250}} in:fly={{x: 500, duration: 250, delay: 250}} class="panel">
    <div class="center">
        <h1><span style="font-size: 50px;" class="material-icons">school</span>Learn</h1>
    </div>

    <div class="container">
        <h2>Zuletzt angesehen</h2>

        <div class="content">
            <div class="element">
                <span style="font-size: 100px;" class="material-icons">feed</span>
                <p>Induktion</p>
            </div>

            <div class="element">
                <span style="font-size: 100px;" class="material-icons">group</span>
                <p>Mathe VK</p>
            </div>

            <div class="element">
                <span style="font-size: 100px;" class="material-icons">menu_book</span>
                <p>3. Latein KA</p>
            </div>

            <div class="element">
                <span style="font-size: 100px;" class="material-icons">menu_book</span>
                <p>3. Mathe KA</p>
            </div>
        </div>
    </div>

    <div class="container">
        <div class="titlebar">
            <h2>Klassenarbeiten</h2>
            <span style="transform: rotate(180deg);" class="material-icons">arrow_back</span>
        </div>

        <div class="content">
            <div class="element">
                <span style="font-size: 100px;" class="material-icons">menu_book</span>
                <p>3. Mathe KA</p>
            </div>

            <div class="element">
                <span style="font-size: 100px;" class="material-icons">menu_book</span>
                <p>1. Musik KA</p>
            </div>

            <div class="element">
                <span style="font-size: 100px;" class="material-icons">menu_book</span>
                <p>5. Latein KA</p>
            </div>
        </div>
    </div>

    <div class="container">
        <div class="titlebar">
            <h2>Gruppen</h2>
            <span on:click={() => goto('/app/groups')} style="transform: rotate(180deg);" class="material-icons">arrow_back</span>
        </div>

        <div class="content">
            <div class="element">
                <span style="font-size: 100px;" class="material-icons">group</span>
                <p>Klasse 10e</p>
            </div>

            <div class="element">
                <span style="font-size: 100px;" class="material-icons">group</span>
                <p>Physik LK</p>
            </div>

            <div class="element">
                <span style="font-size: 100px;" class="material-icons">group</span>
                <p>Latein LK</p>
            </div>
        </div>
    </div>
</div>

<style lang="scss">

    .panel {
        width: 100%;
        max-width: 1400px;
        height: calc(100vh - 3.8em);
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

    .container {
        margin: 1em;
        margin-top: 0;

        .content {
            display: flex;
            gap: 0.5em;
            margin: 1.3em 0.3em;
            width: 100%;
            background-color: var(--menu-color);
            border-radius: 1em;
            padding: 1.2em;

            .element {
                cursor: pointer;
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                transition: 250ms ease;
                padding: 0.2em 0.8em 1em 0.8em;
                border-radius: 1em;

                span {
                    color: var(--highlight-color);
                }

                &:hover {
                    background-color: var(--hover-color);
                }
            }
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