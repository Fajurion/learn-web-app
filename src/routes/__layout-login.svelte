<script context="module" lang="ts">
import Notification from "$lib/components/notification.svelte";
import type { Load } from "@sveltejs/kit";

    export const load: Load = ({session}) => {

        if(session.user) {
            return {
                status: 302,
                redirect: '/app'
            }
        }

        return {}
    }
</script>

<div class="main">
    <slot />
</div> 

<Notification />

<style lang="scss">
    .main {
        position: relative;
        width: 100%;
        height: 100vh;
        background-color: var(--background-color);
        color: var(--text-color);
        gap: 1.5em;
    }
</style>