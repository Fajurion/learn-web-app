<script context="module" lang="ts">
    import type { Load } from "@sveltejs/kit";

    export const load: Load = (session: any) => {
    
    if(!session.user) {
        return {
            status: 302,
            redirect: '/'
        }
    }

    return {}
}
</script>

<slot />