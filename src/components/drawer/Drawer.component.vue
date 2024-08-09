<template>
    <div :class="direction !== 'vertical' ? 'h-10 min-h-10 w-screen' : 'w-10 min-w-10 h-full'">
        <div :class="expanderClass" class="left-0 top-0  bg-primary flex border-accent border-b ">
            <slot />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { DrawerProps } from './Drawer.props';

const props = withDefaults(defineProps<DrawerProps>(), {
    direction: () => "horizontal",
    expand: () => false
})

const expanderClass = computed(() => {
    const sizing = {
        horizontal: 'w-full h-10',
        vertical: 'h-full w-10 py-2 flex-col'
    }

    const expanding = {
        vertical: 'hover:w-64 transition-[width]',
        horizontal: 'hover:h-64 transition-[height]'
    }

    return [sizing[props.direction], ...(props.expand ? [expanding[props.direction]] : [])].join(' ')
})

</script>