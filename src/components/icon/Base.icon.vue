<template>
    <slot>
        <span :class="`material-symbols-${style}`" v-bind="$attrs">{{ name }}</span>
    </slot>
</template>

<script setup lang="ts">
import { type IconProps } from './icon.type'
const props = withDefaults(defineProps<IconProps>(), {
    style: () => "outlined",
})

</script>