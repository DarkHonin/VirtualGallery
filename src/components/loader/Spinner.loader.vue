<template>
    <div class="loader-spinner  text-label-primary w-min h-min animate-pulse flex flex-col overflow-visible"
        v-bind="$attrs" v-if="loading">
        <BrandGraphic v-bind="graphicSize" name="progress_activity" />
        <label class="text-center m-auto">
            <slot name="message" :bind="{ message }">
                {{ message }}
            </slot>
        </label>
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

const graphicSize = computed(() => {
    const sizes = {
        ss: "25",
        xs: "50",
        sm: "75",
        md: "100",
        lg: "150"
    }
    return { width: sizes[props.size], height: sizes[props.size] }
})

</script>
