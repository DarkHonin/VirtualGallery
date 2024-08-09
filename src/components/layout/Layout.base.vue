<template>
    <div class="layout-base">
        <aside v-if="$slots['top']" class="layout-base__top" :class="sticky('top')">
            <slot name="top" />
        </aside>

        <aside v-if="$slots['left']" class="layout-base__left" :class="sticky('left')">
            <slot name="left" />
        </aside>

        <section class="layout-base__content">
            <slot />
        </section>

        <aside v-if="$slots['right']" class="layout-base__right">
            <slot name="right" />
        </aside>

        <aside v-if="$slots['bottom']" class="layout-base__bottom">
            <slot name="bottom" />
        </aside>

    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { LayoutEdgeDirection, type LayoutBaseProps } from './Layout.props';


const props = withDefaults(defineProps<LayoutBaseProps>(), {
})

const sticky = (edge: keyof typeof LayoutEdgeDirection) => {
    if (props.stick == undefined || !edge) return
    const stickClass: { [key in keyof typeof LayoutEdgeDirection]: string } = {
        top: "sticky top-0 z-50",
        left: "fixed top-10 z-50",
        bottom: "",
        right: ""
    }
    if (props.stick.includes(edge)) return [stickClass[edge]].join(' ')
}

</script>

<style lang="scss">
$edge-size: 2.5em;

.layout-base {
    display: grid;
    min-height: 100vh;
    max-width: 100vw;
    grid-template-rows: $edge-size auto $edge-size;
    grid-template-columns: $edge-size auto $edge-size;
    overflow-x: hidden;
    overflow-y: auto;
    max-height: 100vh;

    .layout-base__content {
        grid-row-start: 1;
        grid-row-end: -1;
        grid-column-start: 1;
        grid-column-end: -1;
    }

    .layout-base__top {
        grid-column: 2;
        grid-row: 1;
        grid-column-start: 1;
        grid-column-end: -1;

    }

    .layout-base__bottom {
        grid-row: 3;
    }

    .layout-base__left {
        grid-row-start: 1;
        grid-row-end: -1;
        grid-column: 1;
        grid-row-start: 2;
    }



    &:has(.layout-base__top) {
        .layout-base__content {
            grid-row-start: 2;
        }

        .layout-base__left {
            height: calc(100vh - $edge-size)
        }
    }

    &:has(.layout-base__left) {
        .layout-base__content {
            grid-column-start: 2;
        }

        .layout-base__bottom {
            grid-column-start: 2;
        }
    }

    &:has(.layout-base__right) {
        .layout-base__content {
            grid-column-end: 2;
        }
    }

    &:has(.layout-base__bottom) {
        .layout-base__content {
            grid-row-end: 2;
        }
    }

}
</style>