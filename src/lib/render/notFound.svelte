<script lang="ts">
    import "$lib/styles/align.scss"


    export let margin = '4em'
    export let text = 'Nichts gefunden!'

</script>

<div style="margin-top: {margin};" class="cc column">
    <span class="material-icons colored found" style="font-size: 80px;">search</span>
    <h2>{text}</h2>
</div>

<style lang="scss">

    .found {
        animation: found 10s infinite;
        text-shadow: 2px 2px 10px black;
    }

    @keyframes found {
        0% {
            transform: translate(-130%, -22%) scale(1);
        }
        20% {
            transform: translate(187%, 124%) scale(1.1);
        }
        40% {
            transform: translate(-170%, 82%) scale(0.9);
        }
        60% {
            transform: translate(-37%, -31%) scale(1.2);
        }
        80% {
            transform: translate(140%, 53%) scale(0.9);
        }
        100% {
            transform: translate(-130%, -22%) scale(1);
        }
    }

</style>