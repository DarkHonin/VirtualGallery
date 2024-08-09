<template>
    <div v-bind="$attrs" ref="root">
        <svg v-bind="windowSize" :view-box="`0 0 ${windowSize.width} ${windowSize.height}`" id="starfield"
            xmlns="http://www.w3.org/2000/svg">
            <defs>
                <radialGradient id="starGradient0">
                    <stop offset="0%" stop-color="#FFBBBB" />
                    <stop offset="100%" stop-color="transparent" />
                    <animate attributeName="fy" dur="700ms" values="0%;90%;0%" repeatCount="indefinite" />
                </radialGradient>
                <radialGradient id="starGradient1">
                    <stop offset="0%" stop-color="#BBFFBB" />
                    <stop offset="100%" stop-color="transparent" />
                    <animate attributeName="fy" dur="700ms" values="0%;90%;0%" repeatCount="indefinite" />
                </radialGradient>
                <radialGradient id="starGradient2">
                    <stop offset="0%" stop-color="#FFFFBA" />
                    <stop offset="100%" stop-color="transparent" />
                    <animate attributeName="fy" dur="700ms" values="0%;90%;0%" repeatCount="indefinite" />
                </radialGradient>
            </defs>
            <rect v-bind="windowSize" fill="black" />
            <StarGraphic v-for="i in 100" :key="i" :fill="`url(#starGradient${i % 3})`"
                :transform="`translate(${randomPosition().join(', ')}), scale(${max(0.2, random())})`" />


        </svg>

    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import StarGraphic from './Star.graphic.vue';


const windowSize = ref({
    width: 0,
    height: 0
})

const root = ref<HTMLElement>()

const { random, max } = Math

const handleScreenResize = () => {
    if (!root.value) return
    const { width, height } = root.value.getBoundingClientRect()
    windowSize.value = {
        width, height
    }
}

const randomPosition = () => {
    const { width, height } = windowSize.value
    const [x, y] = [width, height].map(e => e * Math.random())
    return [x, y]
}

onMounted(() => {
    window.addEventListener("resize", handleScreenResize)
    handleScreenResize()
})

onBeforeUnmount(() => {
    window.removeEventListener("resize", handleScreenResize)
})
</script>