<script lang="ts">
    import { fly } from "svelte/transition"

</script>

<div class="panel">
    <div class="center">
        <h1 in:fly={{y: 200}} >FaJurion Learn</h1>
    </div>

    <div in:fly={{y: 200, delay: 150}} class="container">
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

    <div in:fly={{y: 200, delay: 300}} class="container">
        <h2>Klassenarbeiten</h2>

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

    <div in:fly={{y: 200, delay: 450}} class="container">
        <h2>Gruppen</h2>

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
        margin: 1em 2em;
    }

    .container {
        margin: 1.5em;
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

</style>