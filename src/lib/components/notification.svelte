<script lang="ts">
    import {alertColor, alertMessage, showAlert} from "$lib/components/notificationStore"

</script>

<!-- Hide/show notification -->
<div class={$showAlert ? 'shown' : ''}>

    <!-- Notification Text -->
    <p style={'background-color: ' + $alertColor + ';'}>{$alertMessage}</p>
</div>

<style lang="scss">
    div {
        pointer-events: none;
        position: absolute;
        top: 1em;
        width: 100%;
        display: flex;
        justify-content: center;
        color: white;
        transition: 250ms ease;
        transform: scale(0.8);
        opacity: 0;
    }

    p {
        width: fit-content;
        padding: 0.4em 1em;
        font-weight: bold;
        border-radius: 0.6em;
    }

    .shown {
        transform: scale(1);
        opacity: 1;
    }
</style>