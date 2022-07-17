<script lang="ts">
import { goto } from "$app/navigation";


    function returnToStart() {
        goto('/app')
    }
</script>

<div class="account">
    
</div>

<div class="nav">

    <div on:click={returnToStart} class="title">
        <span class="material-icons">menu</span>
        <h2>Learn</h2>
    </div>

    <div class="navigation">
        <span class="material-icons">notifications</span>
        <span class="material-icons">image</span>
        <span class="material-icons">account_circle</span>
    </div>
</div>

<style lang="scss">
    .nav {
        padding: 0.5em;
        background-color: var(--box-color);
        display: flex;
        justify-content: space-between;
        align-items: center;

        .material-icons {
            font-size: 29px;
        }

        .title {
            display: flex;
            align-items: center;
            gap: 0.5em;
            justify-content: center;
            padding: 0.5em 0.8em;
            cursor: pointer;
            transition: 250ms all ease;
            border-radius: 0.5em;

            &:hover {
                background-color: var(--hover-color);
            }
        }

        .navigation {
            padding: 0em 0.6em;
            display: flex;
            align-items: center;
            gap: 0.1em;
            justify-content: center;

            span {
                border-radius: 1em;
                padding: 0.2em;
                cursor: pointer;
                transition: 250ms ease;

                &:hover {
                    color: var(--highlight-color);
                }
            }

            .selected {
                background-color: var(--hover-color);
            }
        }
    }
</style>