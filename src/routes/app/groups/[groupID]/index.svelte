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

        }} style="font-size: 27px;" class="material-icons clickable">edit</span>
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

    <div class="row">
        <h2>Klassenarbeiten</h2>
        <span on:click={() => goto('/app/groups/' + $currentGroup.id + "/exams")} style="font-size: 27px;"
             class="material-icons clickable">arrow_forward</span>
    </div>

    {#if $currentGroup.exams}

    {#if !$currentGroup.exams[0]}
    <div class="horizontal cc">
        <div class="element">
            <span style="font-size: 50px;" class="material-icons">add_circle</span>
            <p style="margin-top: 10px;">Hinzufügen</p>
        </div>
    </div>

    {:else}

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

    {/if}

    {/if}
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
    }

    .clickable {
        padding: 0.3em;
        border-radius: 1em;
        transition: 250ms ease;
        cursor: pointer;

        &:hover {
            color: var(--highlight-color);
            background-color: var(--hover-color);
        }
    }

</style>
