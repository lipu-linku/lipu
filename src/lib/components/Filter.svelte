<script>
    import Checkbox from './Checkbox.svelte';

    export let categories;
</script>

<div id="checkbox_container">
    <div id="usage_selector">
        {#each categories as category}
        <Checkbox name={category.name} bind:checked={category.checked}/>
        {/each}
    </div>
</div>


<style>

    #checkbox_container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
    margin-top: 1rem;
    }

</style>
