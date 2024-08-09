<template>
    <slot>
        <span :class="`material-symbols-${style}`">{{ name }}</span>
    </slot>
</template>

<script setup lang="ts">
import { type IconProps } from './icon.type'
const props = withDefaults(defineProps<IconProps>(), {
    style: () => "outlined",
})

</script>