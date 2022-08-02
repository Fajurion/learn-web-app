<script lang="ts">
import { onMount } from "svelte"
import { page } from "$app/stores"

    onMount(() => {
        console.log($page.params.postID)
    })

</script>
