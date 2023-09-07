<script>
    export let name;
    export let checked;
</script>

<label class="container">
    {name}
    <input
        type="checkbox"
        id={"checkbox_" + name}
        autocomplete="off"
        bind:checked
    >
    <span class="checkmark"></span>
</label>

<style>
    /* The container */
    .container {
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    justify-content: flex-end;
    gap: 0.5rem;

    margin-top: 4px;
    cursor: pointer;
    user-select: none;
    }

    /* Hide the browser's default checkbox */
    .container input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
    }

    /* Create a custom checkbox */
    .checkmark {
    position: relative;
    height: 20px;
    width: 20px;
    background-color: #eee;
    border-radius: 0.25rem;
    transition: background-color 0.2s;
    }

    /* On mouse-over, add a grey background color */
    .container:hover input ~ .checkmark {
    background-color: var(--shade-color);
    }

    /* When the checkbox is checked, add a gold background */
    .container input:checked ~ .checkmark {
    background-color: var(--highlight-color);
    }

    /* Checkmark indicator */
    .container .checkmark:after {
    content: "";
    position: absolute;
    opacity: 0;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='none' d='M0 0h24v24H0z'/%3E%3Cpath d='M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z'/%3E%3C/svg%3E");
    background-size: cover;
    transition: opacity 0.2s;
    }

    /* Show the checkmark when checked */
    .container input:checked ~ .checkmark:after {
    opacity: 1;
    }

    /* When the checkmark is focused, add an outline to the checkbox */
    .container input:focus-visible ~ .checkmark {
    outline: 2px solid var(--highlight-color);
    outline-offset: 2px;
    }

</style>
