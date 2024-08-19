<template>
    <svg :view-box="`0 0 ${width} ${height}`" v-bind="{ ...props, }">
        <slot />
    </svg>
</template>

<script setup lang="ts">

const props = defineProps<{
    width: number,
    height: number
}>()

</script>