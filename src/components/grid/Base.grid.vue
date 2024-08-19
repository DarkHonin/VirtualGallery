<template>
    <div class="flex gap-2 items-start justify-start mb-auto w-auto px-2 h-auto flex-wrap">
        <slot name="prepend" v-bind="{ itemClassString }" />

        <template v-for="i, k in items" :key="k">
            <component :is="slots.item" v-bind="{ item: i, itemClassString }" />
        </template>

    </div>
</template>

<script lang="ts" setup>

const slots = defineSlots<{
    item(props: { item: any, itemClassString: string }): void,
    prepend(props: { itemClassString: string }): void
}>()

const props = defineProps<{
    items: any[]
}>()

const itemClassString = "bg-cover bg-center flex-grow w-52 h-full min-h-52 max-w-52  flex-col flex justify-start border border-primary hover:scale-95 cursor-pointer transition-transform bg-contain bg-no-repeat"


</script>