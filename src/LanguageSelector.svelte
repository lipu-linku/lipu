<script>
</script>

<label id="language_selector_wrapper" title="Select Language">
    <select
        id="language_selector"
        class="main_input"
        onchange="language_select_changed(this)"
    ></select>
    <img src="./assets/world.png" alt="Select language" />
</label>

<style>
    #language_selector {
        font: inherit;
        background-color: var(--bg-color);
        color: var(--txt-color);

        cursor: pointer;
        position: absolute;

        top: 0;
        left: 0;
        width: 100%;
        height: 100%;

        opacity: 0;
    }

    #language_selector + img {
        pointer-events: none;
        border-radius: 100%;
    }
    #language_selector:focus + img {
        outline: 2px solid var(--highlight-color);
        outline-offset: 2px;
    }

    #language_selector_wrapper {
        position: relative;
    }

    img {
        width: 2rem;
        height: 2rem;
        display: block;
    }
    :global(.lightmode) img {
        filter: invert(100%);
    }
</style>
