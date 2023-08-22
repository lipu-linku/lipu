<script>
    export let lightmode;
</script>

<label id="checkbox_lightmode_wrapper">
    <input type="checkbox" id="checkbox_lightmode" bind:checked={lightmode}/>
    <img src="./assets/suno.png" alt="Light Mode" />
</label>

<style>
    #checkbox_lightmode {
        cursor: pointer;
        position: absolute;

        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10;

        opacity: 0;
    }
    #checkbox_lightmode_wrapper {
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
