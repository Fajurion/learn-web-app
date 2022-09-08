<script lang="ts">
import { page } from "$app/stores";
import { loadExam, currentExam } from "$lib/exams/exams";
import "$lib/styles/align.scss"
import Exambar from "$lib/exams/exambar.svelte";
import { onMount } from "svelte";
import { requesting } from "$lib/configuration";

onMount(() => {
    load()
})

function load() {
    loadExam(parseInt($page.params.examID))
}

</script>

<Exambar />

<div class="pp">

    {#if $currentExam}
    <slot />
    {/if}

</div>

{#if !$currentExam && !$requesting}

<div style="margin-top: 4em" class="cc">
    <h2>Keine Klassenarbeit gefunden!</h2>
</div>

{/if}

<style lang="scss">

    .pp {
        width: 100%;
        display: flex;
        justify-content: center;
        height: 100%;
    }

</style>
