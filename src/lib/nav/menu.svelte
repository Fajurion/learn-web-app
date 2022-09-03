<script lang="ts">
import { goto } from "$app/navigation";
import { permissions } from "$lib/configuration";
import { menuOpen } from "$lib/nav/menuStore";

    /**
     * Changes url
     * @param url new url
     */
    function closeMenu(url: string) {
        goto(url)
    }

</script>

<!-- Background of the menu -->
<div on:click={() => menuOpen.set(false)} class="main {$menuOpen ? '' : 'main-hidden'}">

    <!-- Menu -->
    <div class="menu {$menuOpen ? '' : 'menu-hidden'}">
        
        <!-- Buttons in the top left -->
        <div class="buttons">
            <h2 on:click={() => closeMenu('/app/groups/')}><span style="font-size: 30px;" class="material-icons">group</span>Gruppen</h2>
            <h2 on:click={() => closeMenu('/app/exams/')}><span style="font-size: 30px;" class="material-icons">menu_book</span>Klassenarbeiten</h2>
            {#if $permissions.includes('view.admin.panel')}
            <h2 on:click={() => closeMenu('/app/exams/')}><span style="font-size: 30px;" class="material-icons">shield</span>Admin Panel</h2>
            {/if}
        </div>

        <!-- Buttons in the bottom left -->
        <div class="across">
            <h3 on:click={() => closeMenu('/app/guides/')}><span style="font-size: 25px;" class="material-icons">insights</span>Meine Daten</h3>
            <h3 on:click={() => closeMenu('/app/guides/')}><span style="font-size: 25px;" class="material-icons">logout</span>Ausloggen</h3>
        </div>

    </div>
</div>

<style lang="scss">

    .main {
        display: flex;
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
        justify-content: space-between;
        height: 100vh;
        width: 90%;
        padding: 0em 0.3em;
        max-width: 350px;
        background-color: var(--box-color);
        transition: transform 250ms ease;

        h2 {
            cursor: pointer;
            user-select: none;
            margin: 0.3em;
            display: flex;
            align-items: center;
            color: var(--text-color);
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

        h3 {
            cursor: pointer;
            user-select: none;
            margin: 0.3em;
            display: flex;
            align-items: center;
            color: var(--text-color);
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

        .across {
            display: flex;
        }
    }

    .menu-hidden {
        transform: translate(-100%, 0);
    }

</style>