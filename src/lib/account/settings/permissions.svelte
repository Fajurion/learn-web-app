<script lang="ts">
import { permissions } from "$lib/configuration";
import { accountData } from "../account";
import "$lib/styles/tooltip.scss"

</script>

<p>Alle Berechtigungen die hier stehen sind auf Englisch, da diese Plattform auch mal für andere Schulen gedacht
    ist und nicht nur hier benutzt werden soll.
</p>

{#if !$permissions[0]}
<div class="cc" style="margin-top: 25px;">
    <p>Du hast keine erweiterten Berechtigungen!</p>
</div>
{/if}

<ul style="margin-top: 15px;">
    <li class="b-tooltip" data-ttext="Dein Rang"><span class="material-icons">military_tech</span>{$accountData.rank}</li>
    {#each $permissions as permission}
    <li><span class="material-icons">done_all</span>{permission}</li>
    {/each}
</ul>

<style lang="scss">
    ul {
        display: flex;
        flex-direction: column;
        gap: 0.6em;
        list-style: none;

        li {
            user-select: none;
            width: max-content;
            display: flex;
            align-items: center;
            gap: 0.3em;
            
            span {
                color: var(--highlight-color);
            }
        }
    }
</style>
