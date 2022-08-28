<script context="module" lang="ts">
import Sidebar from "$lib/sidebar/sidebar.svelte";
import Navigation from "$lib/nav/navigation.svelte";
import type { Load } from "@sveltejs/kit"; 
import Notification from "$lib/components/notification.svelte";
import Menu from "$lib/nav/menu.svelte";
import { sidebarOpen } from "$lib/nav/menuStore";

    export const load: Load = ({session}) => {
    
    if(!session.user) {
        return {
            status: 302,
            redirect: '/'
        };
    }

    return {};
}

</script>

<script lang="ts">
    import { page } from "$app/stores";

    page.subscribe(() => {
        sidebarOpen.set(false)
    })
</script>


<Menu />

<Notification />

<div class="main">
    <Navigation />
    <div class="panel">
        <div class="sb {$sidebarOpen ? '' : 'sb-hidden'}">
            <Sidebar />
        </div>
        
        <div class="main-panel">
            <slot />
        </div>
    </div>
</div>

<style lang="scss">
    .main {
        width: 100%;
        height: 100vh;
        background-color: var(--background-color);
        color: var(--text-color);
        overflow: hidden;
    }
    
    .panel {
        width: 100%;
        display: flex;
        overflow: hidden;
    }

    .main-panel {
        width: 100%;
        height: 100%;
        overflow: hidden;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
    }

    .sb {
        width: 100%;
        max-width: 380px;
    }

    @media only screen and (max-width: 1400px) {
        .sb {
            position: absolute;
            z-index: 1;
            transition: transform 250ms ease;
        }

        .sb-hidden {
            pointer-events: none;
            transform: translate(-100%, 0);
        }
    }
</style>