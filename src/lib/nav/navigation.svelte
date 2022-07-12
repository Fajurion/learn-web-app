<script>
</script>

<div class="nav">

    <div class="title">
        <span class="material-icons">menu</span>
        <h2>Learn</h2>
    </div>

    <div class="navigation">
        <span class="material-icons">mail</span>
        <span class="material-icons">account_circle</span>
        <span class="material-icons">settings</span>
    </div>
</div>

<style lang="scss">
    .nav {
        padding: 0.5em;
        background-color: var(--box-color);
        display: flex;
        justify-content: space-between;
        align-items: center;

        .material-icons {
            font-size: 29px;
        }

        .title {
            display: flex;
            align-items: center;
            gap: 0.5em;
            justify-content: center;
            padding: 0.5em 0.8em;
            cursor: pointer;
            transition: 250ms all ease;
            border-radius: 0.5em;

            &:hover {
                background-color: var(--hover-color);
            }
        }

        .navigation {
            padding: 0.5em;
            display: flex;
            align-items: center;
            gap: 0.5em;
            justify-content: center;
        }
    }
</style>