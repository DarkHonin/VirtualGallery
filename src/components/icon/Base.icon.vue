<template>
    <slot>
        <span :size="size" class="base-icon" :class="`material-symbols-${style}`" v-bind="$attrs">{{ name }}</span>
    </slot>
</template>

<script setup lang="ts">
import { type IconProps } from './icon.type'
const props = withDefaults(defineProps<IconProps>(), {
    style: () => "outlined",
    size: () => 'md'
})

</script>

<style lang="scss">
.base-icon {
    font-size: 16px;
    line-height: 16px;

    [size="sm"] {
        font-size: 10px;
        line-height: 10px;
    }

    [size="lg"] {
        font-size: 24px;
    }

}
</style>