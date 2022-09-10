<script lang="ts">

import { fly } from "svelte/transition";

</script>

<div class="panel">
    <div class="center">
        <h1><span style="font-size: 50px;" class="material-icons">quiz</span>Erklärungen</h1>
    </div>
    
    <h2>Hier kommen bald Sachen!</h2>
</div>

<style lang="scss">
    .center {
        width: 100%;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
    }

    h1 {
        display: flex;
        align-items: center;
        gap: 0.3em;
        margin: 1em 2em;

        span {
            color: var(--highlight-color);
        }
    }
</style>