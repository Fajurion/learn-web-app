<script lang="ts">
import { goto } from "$app/navigation";
import { menuOpen } from "$lib/nav/menuStore";


    function returnToStart() {
        goto('/app')
    }
</script>

<div class="account">
    
</div>

<div class="nav">

    <div class="title">
        <span on:click={() => menuOpen.set(true)} class="material-icons">menu</span>
        <h2 on:click={returnToStart}><span class="material-icons">school</span>Learn</h2>
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
            justify-content: center;
            padding: 0em 0.8em;
            border-radius: 0.5em;
            gap: 0.3em;

            span {
                padding: 0.3em;
                cursor: pointer;
                border-radius: 1em;
                transition: 250ms ease;

                &:hover {
                    background-color: var(--hover-color);
                }
            }
            
            h2 {
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 0.1em 0.5em 0.1em 0.1em;
                cursor: pointer;
                transition: 250ms ease;
                border-radius: 0.3em;

                &:hover {
                    background-color: var(--hover-color);
                }
                
                span {
                    color: var(--highlight-color);
                }
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