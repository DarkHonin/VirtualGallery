<template>
    <div class="loader-spinner  text-label-primary w-min h-min animate-pulse inline-flex overflow-visible"
        v-bind="$attrs" v-if="loading">
        <BrandGraphic width="100" height="100" name="progress_activity" />
        <label class="text-center m-auto">{{ message }}</label>
    </div>
    <slot v-else></slot>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import BaseIcon from '../icon/Base.icon.vue';
import { type BaseLoaderProps } from './loader.types'
import BrandGraphic from '../graphics/Brand.graphic.vue';

const props = withDefaults(defineProps<BaseLoaderProps>(), {
    size: () => "sm"
})

const size = computed(() => {
    const sizes = {
        sm: "scale-100",
        md: "scale-125",
        lg: "scale-150"
    }
    return sizes[props.size]
})

</script>
