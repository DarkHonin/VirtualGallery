<template>
    <div class="loader-base absolute h-1 w-full inline-flex animate-pulse  bg-primary" v-if="loading">
    </div>
</template>

<script lang="ts" setup>
import { type BaseLoaderProps } from './loader.types'

const props = defineProps<BaseLoaderProps>()

</script>