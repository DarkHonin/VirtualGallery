<template>
    <div class="flex flex-col w-full gap-2 ">
        <div class="col-span-full bg-primary p-2 py-4 font-bold">
            {{ title }}
        </div>

        <slot />
    </div>
</template>

<script setup lang="ts">

const props = defineProps<{
    title: string
}>()


</script>