<script lang="ts">
import Navigation from "$lib/nav/navigation.svelte";
import Sidebar from "$lib/sidebar/sidebar.svelte";
</script>

<div class="main">
    <Navigation />
    <Sidebar />
</div>

<style>
    .main {
        width: 100%;
        height: 100vh;
        background-color: var(--background-color);
        color: var(--text-color);
    }
</style>