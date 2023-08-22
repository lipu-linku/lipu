<script>
    export let query;
    export let lightmode;
    export let selected_language;
    export let selected_view;
    export let languages;

    import Searchbar from './Searchbar.svelte';
    import LightmodeCheckbox from './LightmodeCheckbox.svelte';
    import LanguageSelector from './LanguageSelector.svelte';
    import ViewSelector from './ViewSelector.svelte';

    import ijo_a from '$lib/assets/ijo-a.png';
    import icon from '$lib/assets/icon.png';
</script>

<nav>
    <div class="logo">
        <img src={icon} alt="lipu Linku" />
        lipu Linku
    </div>

    <div class="search_container">
        <Searchbar bind:query />
        <button id="normal_mode_button" onclick="normal_mode()">
            Back to Dictionary
        </button>
    </div>

    <div>
        <LightmodeCheckbox bind:lightmode />
        <ViewSelector bind:selected_view />
        <LanguageSelector bind:selected_language {languages} />

        <a href="about" title="About Linku">
            <img src={ijo_a} alt="About Linku" />
        </a>
    </div>
</nav>

<style>
    nav {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
        position: sticky;
        padding: 0.5rem 1rem;
        top: 0;
        z-index: 1;
        background-color: var(--bg-color);
        border-bottom: 1px solid var(--border-color);
    }

    nav > div {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    nav > :last-child {
        justify-content: end;
    }

    nav img {
        width: 2rem;
        height: 2rem;
        display: block;
    }
    :global(.lightmode) img {
        filter: invert(100%);
    }

    .search_container {
        max-width: 20rem;
        flex-basis: 100%;
        flex-shrink: 0;
    }

    #normal_mode_button {
        font: inherit;
        color: inherit;
        display: none;
        background: var(--bg-alt-color);
        border: 1px solid var(--border-color);
        border-radius: 0.25rem;
        margin: 0 auto;
        padding: 0.25rem 0.5rem;
        cursor: pointer;
        transition: background 0.2s, color 0.2s, border-color 0.2s;
    }
    #normal_mode_button:hover {
        background: var(--highlight-color);
        border-color: var(--highlight-color);
        color: var(--bg-color);
    }

    @media screen and (max-width: 680px) {
        nav {
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-template-areas: "logo" "buttons" "search";
            gap: 0.5rem;
            top: -3rem;
        }

        nav > :first-child {
            white-space: nowrap;
        }

        nav > .search_container {
            grid-area: search;
            grid-column: 1 / -1;
            max-width: 100%;
        }
    }
</style>
