<template>
    <svg :width="svgSize.width" :height="svgSize.height" view-box="0 0 1500 1500" xmlns="http://www.w3.org/2000/svg"
        ref="root" xmlns:xlink="http://www.w3.org/1999/xlink">
        <defs>
            <linearGradient id="spikeFill">
                <stop offset="0%" stop-color="transparent" />
                <stop offset="50%" stop-color="white" />
            </linearGradient>
        </defs>
        <g :transform-origin="center.join(' ')">
            <mask :id="maskId" :width="size[0]" :height="size[1]">
                <rect x="0" y="0" :width="size[0]" :height="size[1]" fill="white" />
                <circle :cx="center[0]" :cy="center[1]" :r="size[0] / 5" fill="black" />
                <rect x="0" y="0" :width="size[0]" :height="center[1]" fill="black" />
                <rect :x="center[0]" y="0" :width="center[0]" :height="size[1]" fill="black" />
            </mask>

            <g :mask="`url(#${maskId})`" :transform-origin="center.join(' ')">
                <path fill="url(#spikeFill)"
                    :d="`M 0,${center[1]} L ${center[0] * 0.9},${center[1] - (center[1] / 10)} L ${center[0] * 0.9},${center[1] + (center[1] / 10)}`"
                    shape-rendering="optimizeQuality" :transform-origin="center.join(' ')">
                    <animateTransform attributeName="transform" attributeType="XML" type="translate"
                        :values="`0 0;${center[0] * 0.1} 0;0 0`" calc-mode="spline" dur="20s"
                        repeatCount="indefinite" />
                </path>
                <path fill="url(#spikeFill)" :transform-origin="center.join(' ')" transform="rotate(-90)"
                    :d="`M 0,${center[1]} L ${center[0]},${center[1] - (center[1] / 10)} L ${center[0]},${center[1] + (center[1] / 10)}`"
                    shape-rendering="optimizeQuality">
                    <animateTransform attributeName="transform" attributeType="XML" type="scale" values="1 1;1 2;1 1"
                        additive="sum" calc-mode="spline" dur="20s" repeatCount="indefinite" />
                </path>
                <circle fill="white" :cx="center[0]" :cy="center[1]" :r="(size[0] / 5) + (size[0] / 50)" />
            </g>
            <g :mask="`url(#${maskId})`" :transform-origin="center.join(' ')" transform="rotate(180)">
                <path fill="url(#spikeFill)"
                    :d="`M 0,${center[1]} L ${center[0]},${center[1] - (center[1] / 10)} L ${center[0]},${center[1] + (center[1] / 10)}`"
                    shape-rendering="optimizeQuality">
                </path>
                <path fill="url(#spikeFill)" :transform-origin="center.join(' ')" transform="rotate(-90)"
                    :d="`M 0,${center[1]} L ${center[0]},${center[1] - (center[1] / 10)} L ${center[0]},${center[1] + (center[1] / 10)}`"
                    shape-rendering="optimizeQuality">
                </path>
                <circle fill="white" :cx="center[0]" :cy="center[1]" :r="(size[0] / 5) + (size[0] / 50)" />
            </g>
            <animateTransform attributeName="transform" attributeType="XML" type="rotate" values="0;360"
                calc-mode="spline" dur="60s" repeatCount="indefinite" />
        </g>
        <g :transform-origin="center.map((e, i) => i % 2 ? e + (e * 0.01) : e - (e * 0.01)).join(' ')">
            <mask :id="irisMaskId">
                <circle :cx="center[0]" :cy="center[1]" :r="size[0] * 0.3" fill="white" />
                <circle :cx="center[0]" :cy="center[1]" :r="size[0] * 0.12" fill="black" />
            </mask>
            <circle :cx="center[0]" :cy="center[1]" :r="size[0] * 0.135" :mask="`url(#${irisMaskId})`" fill="white" />
            <animateTransform attributeName="transform" attributeType="XML" type="rotate" values="0;360"
                calc-mode="spline" dur="60s" repeatCount="indefinite" />
        </g>
    </svg>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

const props = defineProps<{
    width: number,
    height: number
}>()

const root = ref<HTMLElement>()

const maskId = crypto.randomUUID()
const irisMaskId = crypto.randomUUID()

const size = computed(() => {
    if (!root.value) return [0, 0]
    const { width, height } = svgSize.value
    return [width, height]
})

const svgSize = ref({
    width: 0,
    height: 0
})

const handleResize = () => {

    const [width, height] = [props.width, props.height]
    const { min } = Math

    svgSize.value = {
        width: min(width, window.innerWidth),
        height: height
    }
}

onMounted(() => {
    window.addEventListener('resize', handleResize)
    handleResize()
})

onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)
})

const center = computed(() => size.value.map(e => e / 2) as [number, number])

</script>