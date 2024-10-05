<template>
    <div class="waterfall-layout">

        <slot />

    </div>
</template>

<script lang="ts" setup>



</script>

<style lang="scss">
.waterfall-layout {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    overflow-y: auto;
    padding-bottom: 30px;
}
</style>