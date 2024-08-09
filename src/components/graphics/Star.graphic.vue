<template>

    <g>
        <circle v-bind="{ fill }" r="10" transform="scale(1, 0.1)" />
        <circle v-bind="{ fill }" r="10" :transform="`rotate(45), scale(${max(random() * 2, 0.2)}, 0.1)`" />
        <circle v-bind="{ fill }" r="10" :transform="`rotate(-45), scale(${max(random() * 2, 0.2)}, 0.1)`" />
        <circle v-bind="{ fill }" r="10" :transform="`rotate(90), scale(${max(random() * 2, 0.2)}, 0.1)`" />
    </g>
</template>

<script setup lang="ts">

const { random, max } = Math

const props = defineProps<{
    fill?: string
}>()
</script>