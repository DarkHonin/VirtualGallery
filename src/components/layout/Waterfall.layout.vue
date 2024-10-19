<template>
    <div class="waterfall-layout" ref="root">

        <slot />

    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';


const root = ref<HTMLElement>()
defineExpose({
    $el: root
})

</script>

<style lang="scss">
.waterfall-layout {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    overflow-y: auto;
    overflow-x: hidden;
}
</style>