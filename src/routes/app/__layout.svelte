<script context="module" lang="ts">
import Sidebar from "$lib/sidebar/sidebar.svelte";
import Navigation from "$lib/nav/navigation.svelte";
import type { Load } from "@sveltejs/kit"; 
import Notification from "$lib/components/notification.svelte";
import Postbar from "$lib/nav/postbar.svelte";

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

<Notification />

<div class="main">
    <Navigation />
    <div class="panel">
        <Sidebar />
        
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
</style>