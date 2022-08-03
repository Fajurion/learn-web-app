<script lang="ts">
import { goto } from "$app/navigation";
import { menuOpen, sidebarOpen } from "$lib/nav/menuStore";

    // Return to start page
    function returnToStart() {
        goto('/app')
    }
</script>

<!-- Title bar -->
<div class="nav">

    <!-- Element in the top left of the titlebar -->
    <div class="title">
        <span on:click={() => sidebarOpen.set(!$sidebarOpen)} class="material-icons menu-button {$sidebarOpen ? 'selected' : ''}">logout</span>
        <span on:click={() => menuOpen.set(true)} class="material-icons">menu</span>
        <span on:click={returnToStart} class="material-icons blue">school</span>

        <h2 on:click={returnToStart}><span class="material-icons">school</span>Learn</h2>
    </div>

    <!-- Element in the top right of the titlebar -->
    <div class="navigation">
        <span class="material-icons">notifications</span>
        <span class="material-icons">image</span>
        <span class="material-icons">account_circle</span>
    </div>
</div>

<style lang="scss">
    .nav {
        user-select: none;
        padding: 0em 0.5em;
        height: 4.2em;
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

            .blue {
                display: none;
            }

            .menu-button {
                display: none;
            }

            .selected {
                background-color: var(--selected-color);

                &:hover {
                    background-color: var(--selected-color);
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

    @media only screen and (max-width: 400px) {
        .nav .title h2 {
            display: none;
        }

        .nav .title .blue {
            display: block;
            color: var(--highlight-color);
        }
    }

    @media only screen and (max-width: 1000px) {
        .nav .title .menu-button {
            display: block;
        }
    }
</style>