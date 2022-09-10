<script lang="ts">
import "$lib/styles/align.scss"
</script>

<div class="cc column">
    <span class="material-icons colored hammer" style="font-size: 80px;">hardware</span>
    <h2 class="hammered">Kommt bald..</h2>
</div>

<style lang="scss">

    .colored {
        color: var(--highlight-color);
    }

    .hammer {
        animation: hammering 1s infinite;
    }

    .hammered {
        animation: hammered 1s infinite;
    }

    @keyframes hammering {
        0% {
            transform: rotate(0deg) translateX(10%) scaleY(1);
        }

        20% {
            transform: rotate(90deg) translateX(23%) scaleY(1.1);
        }

        25% {
            transform: rotate(90deg) translateX(23%) scaleY(1.2);
        }

        100% {
            transform: rotate(0deg) translateX(10%) scaleY(1);
        }
    }

    @keyframes hammered {
        0% {
            transform: scale(1);
        }

        20% {
            transform: scale(1);
        }

        30% {
            transform: scale(0.9);
        }
    }

</style>