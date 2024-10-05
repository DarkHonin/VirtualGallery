<template>
    <component :is="to ? RouterLink : 'span'" v-bind="$props" class="nav-link">
        <slot />
    </component>
</template>

<script lang="ts" setup>
import { type RouteLocationAsRelativeGeneric, type RouteLocationAsPathGeneric, RouterLink } from 'vue-router';


defineProps<{
    to?: string | RouteLocationAsRelativeGeneric | RouteLocationAsPathGeneric
}>()



</script>

<style lang="scss">
.nav-link {
    cursor: pointer;
    font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
    font-size: 16px;

    transition: background-color .2s;
    padding: 2px;

    &:hover {
        background-color: var(--background);
    }
}
</style>