<template>
    <component :is="to ? RouterLink : 'span'" v-bind="$props" class="nav-link px-4">
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

    &:hover {
        background-color: var(--background-2);
    }

    &.router-link-exact-active {
        background-color: var(--background-2);
    }
}
</style>