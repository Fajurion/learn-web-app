<script lang="ts">
import { goto } from "$app/navigation";
import { menuOpen } from "$lib/nav/menuStore";

    function closeMenu() {
        menuOpen.set(false)
    }

</script>

<div on:click={closeMenu} class="main {$menuOpen ? '' : 'main-hidden'}">
    <div class="menu {$menuOpen ? '' : 'menu-hidden'}">
        
        <h2 on:click={() => goto('/app/')}><span style="font-size: 30px;" class="material-icons">school</span>Learn</h2>
        <h2 on:click={() => goto('/app/groups/')}><span style="font-size: 30px;" class="material-icons">group</span>Gruppen</h2>
        <h2 on:click={() => goto('/app/exams/')}><span style="font-size: 30px;" class="material-icons">menu_book</span>Klassenarbeiten</h2>

    </div>
</div>

<style lang="scss">

    .main {
        position: absolute;
        width: 100%;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 3;
        transition: 250ms ease;
    }

    .main-hidden {
        background-color: rgba(0, 0, 0, 0);
        pointer-events: none;
    }

    .menu {
        display: flex;
        flex-direction: column;
        height: 100vh;
        width: 350px;
        padding: 0em 0.3em;
        max-width: 100%;
        background-color: var(--box-color);
        transition: transform 250ms ease;

        h2 {
            cursor: pointer;
            user-select: none;
            margin: 0.3em;
            display: flex;
            align-items: center;
            color: white;
            padding: 0.5em;
            gap: 0.4em;
            transition: 250ms ease;
            border-radius: 0.5em;

            span {
                color: var(--highlight-color);
            }

            &:hover {
                background-color: var(--hover-color);
            }
        }
    }

    .menu-hidden {
        transform: translate(-100%, 0);
    }

</style>