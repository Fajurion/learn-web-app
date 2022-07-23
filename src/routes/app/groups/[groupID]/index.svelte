<script lang="ts">
import { goto } from "$app/navigation";

import { currentGroup } from "$lib/groups/groups";
import { editDescriptionForm, newDescription } from "$lib/groups/overview";
import "$lib/styles/components.scss"

</script>

<div style="margin-top: 1em;" class="container">
    <div class="title">
        <h2>Beschreibung</h2>
        
        {#if $currentGroup.creator}
        <span on:click={() => {

            editDescriptionForm.set(true)
            newDescription.set($currentGroup.description)

        }} style="font-size: 27px;" class="material-icons">edit</span>
        {/if}
    </div>

    <div class="vertical">
        {#if $currentGroup.description}
        
        {#each $currentGroup.description.split('\n') as line}
    
        {#if line.startsWith('# ')}
        <h2>{line.replace('# ', '')}</h2>
        {:else}
        <p>{line} </p>
        {/if}

        {/each}

        {:else}
        <p>Keine Beschreibung!</p>
        {/if}
    </div>
</div>

<div class="container">
    <h2>Klassenarbeiten</h2>

    <div class="horizontal">
        <div class="element">
            <span style="font-size: 100px;" class="material-icons">menu_book</span>
            <p>3. Mathe KA</p>
        </div>

        <div class="element">
            <span style="font-size: 100px;" class="material-icons">menu_book</span>
            <p>1. Musik KA</p>
        </div>

        <div class="element">
            <span style="font-size: 100px;" class="material-icons">menu_book</span>
            <p>5. Latein KA</p>
        </div>
    </div>
</div>

<div class="container">
    <h2>Mitglieder ({$currentGroup.memberCount})</h2>

    <div class="horizontal">
        {#if $currentGroup.members}
        {#each $currentGroup.members as member}
        <div on:click={() => goto('/app/users/' + member.id)} class="element">
            <span style="font-size: 100px;" class="material-icons">person</span>
            <p>{member.name}</p>
        </div>
        {/each}
        {/if}
    </div>
</div>

<style lang="scss">

    .title {
        display: flex;
        align-items: center;
        justify-content: space-between;

        span {
            padding: 0.3em;
            background-color: var(--box-color);
            border-radius: 1em;
            transition: 250ms ease;
            cursor: pointer;

            &:hover {
                color: var(--highlight-color);
            }
        }
    }

</style>
