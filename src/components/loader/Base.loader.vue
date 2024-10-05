<template>
    <div class="loader-base absolute h-1 w-full inline-flex animate-pulse  left-0 bg-primary bottom-0 z-50"
        v-if="loading">
    </div>
</template>

<script lang="ts" setup>
import { type BaseLoaderProps } from './loader.types'

const props = defineProps<BaseLoaderProps>()

</script>