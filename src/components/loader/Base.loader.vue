<template>
    <div :class="isLoadingClass" class="loader-base w-full inline-flex left-0  bottom-0 z-50 rounded-sm">
        <slot />
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { type BaseLoaderProps } from './loader.types'

const props = defineProps<BaseLoaderProps>()

const isLoadingClass = computed(() => props.loading ? 'animate-bounce border-b border-b-4  border-highlight' : '')


</script>