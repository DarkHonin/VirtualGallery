<template>
    <div :class="{ 'route-active': isPartialMatch && highlightActive }"
        class="drawer-element overflow-x-hidden w-full max-w-full select-none flex flex-nowrap cursor-pointer items-center border-b border-primary hover:border-accent transition-all">
        <component :is="to ? RouterLink : 'div'" :to="to ?? {}"
            :class="{ 'route-active': isPartialMatch && highlightActive }"
            class="flex gap-2 flex-row p-2 hover:bg-primary-hover overflow-x-clip grow-0 w-full  ">
            <slot name="icon" v-if="icon || $slots['icon']">
                <BaseIcon v-if="icon" :name="icon" />
            </slot>
            <label v-if="label" class="cursor-pointer grow-0 text-nowrap text-ellipsis w-auto">{{ label }}</label>
        </component>
        <slot name="actions"></slot>
    </div>
</template>

<script setup lang="ts">
import BaseIcon from '../icon/Base.icon.vue'
import { type RouteLocationAsRelativeGeneric, type RouteLocationAsPathGeneric, RouterLink, useRoute, type RouteLocationMatched } from 'vue-router'
import { computed } from 'vue'
const props = withDefaults(defineProps<{
    icon?: string,
    label?: string | undefined,
    to?: RouteLocationAsRelativeGeneric | RouteLocationMatched | string,
    highlightActive?: boolean
}>(), {
    highlightActive: () => true
})

const route = useRoute()

const isPartialMatch = computed(() => {
    if (!props.to) return false
    return route.matched.find(e => {
        if (typeof props.to == 'string')
            return e.name == props.to
        return props.to?.name == e.name
    })
})

</script>

<style lang="scss">
.drawer-element {
    &__children {
        transition: all 0.5s;
        max-height: 0%;
        height: 0px;
        overflow: hidden;
        // opacity: 0;
    }

    &:hover {
        .drawer-element__children {
            max-height: 100%;
            opacity: 1;
            height: fit-content;
        }
    }
}
</style>