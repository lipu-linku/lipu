<script>
    import Checkbox from './Checkbox.svelte';
</script>

<div id="checkbox_container">
    <div id="usage_selector">
        <Checkbox name="core"/>
        <Checkbox name="widespread"/>
        <Checkbox name="common"/>
        <Checkbox name="uncommon"/>
        <Checkbox name="rare"/>
        <Checkbox name="obscure"/>
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
