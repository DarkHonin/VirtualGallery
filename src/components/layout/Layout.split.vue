<template>
    <div class="layout-split" :style="layoutStyle">
        <slot />
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import type { LayoutSplitProps } from './Layout.props';


const props = withDefaults(defineProps<LayoutSplitProps>(), {
    cells: () => 2,
    direction: () => 'horizontal'
})

const layoutStyle = computed(() => props.direction == 'horizontal' ? `grid-template-columns: repeat(${props.cells}, 1fr)` : `grid-template-rows: repeat(${props.cells}, 1fr)`)

</script>

<style lang="scss">
.layout-split {
    display: grid;
}
</style>