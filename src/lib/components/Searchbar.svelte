<script>
    export let query;
</script>

<input
    id="searchbar"
    class="searchbar main_input"
    placeholder="nimi"
    autocapitalize="off"
    autocomplete="off"
    autocorrect="off"
    spellcheck="false"
    bind:value="{query}"
/>

<style>
    .searchbar {
        text-align: center;
        font-size: 150%;
        font-family: inherit;
        font-weight: bold;
        font-style: italic;
        width: 100%;
        background-color: var(--bg-alt-color);
        color: var(--highlight-color);
        border: 1px solid var(--border-color);
        border-radius: 0.25rem;
        padding: 0.25rem 0;
    }

    .main_input {
        border: 1px solid var(--border-color);
        border-radius: 0.25rem;
        transition: box-shadow 0.2s, border 0.2s;
    }
    .main_input:focus {
        outline: none;
        box-shadow: 0 0 0 1px var(--highlight-color);
        border-color: var(--highlight-color);
    }

    ::placeholder {
        color: var(--shade-color);
        opacity: 0.5;
    }
</style>
