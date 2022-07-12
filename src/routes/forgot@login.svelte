<main>
    <h2>Gerade nicht verfügbar</h2>
    <p><a href="/">Zurück zur Anmeldung</a></p>

    <div class="form">
        <h2>Passwort zurücksetzen</h2>
        <input type="text" placeholder="Benutzername">
        <input type="password" placeholder="Passwort">
        <input type="password" placeholder="Neues Passwort">
        <button>Zurücksetzen</button>
    </div>

</main>

<style lang="scss">

    main {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        gap: 1.3em;
    }

    h2 {
        font-size: 30px;
        margin-bottom: 30px;
    }

    .form {
        visibility: hidden;
        transform: 250ms ease;
        width: 100%;
        max-width: 400px;
        padding: 1.6em 1.2em;
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: var(--box-color);
        border-radius: 1em;
    }
    
    input {
        margin-top: 10px;
        outline: none;
        border: none;
        width: 85%;
        max-width: 400px;
        font-size: 18px;
        padding: 0.5em 0.6em;
        border-radius: 0.3em;
        background-color: var(--menu-color);
        color: var(--text-color);
    }

    p a {
        margin-left: 5px;
    }
    
    button, a {
        text-decoration: none;
        margin-top: 20px;
        outline: none;
        border: none;
        width: 85%;
        max-width: 400px;
        font-size: 18px;
        padding: 0.5em 1em;
        border-radius: 0.3em;
        background-color: var(--menu-color);
        color: var(--text-color); 
        transition: 250ms ease;
        cursor: pointer;

        &:hover {
            background-color: var(--hover-color);
        }
    }
</style>