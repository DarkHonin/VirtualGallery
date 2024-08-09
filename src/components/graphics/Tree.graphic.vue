<template>
    <g>
        <path :d="`m ${center[0] - (trunkWidth * center[0])} ${center[1]} 
                    C ${center[0] - (trunkWidth * center[0])},${center[1]} 
                        ${center[0] - (trunkWidth * center[0])},${size[1]} 
                        ${center[0] - (trunkWidth * center[0] * 2)},${size[1]} 
                    L ${center[0] + (trunkWidth * center[0] * 2)},${size[1]} 
                    C ${center[0] + (trunkWidth * center[0])},${size[1]} 
                        ${center[0] + (trunkWidth * center[0])},${center[1]} 
                        ${center[0] + (trunkWidth * center[0])},${center[1]} 
                    L ${center[0] - (trunkWidth * center[0])} ${center[1]} `" stroke="black" fill="transparent" />
        <g :transform="`translate(${center[0]} ${(center[1] / 4) + (toRange(rows - r, rows) * center[1])})`"
            v-for="r in rows" :key="r">
            <path :d="leafPath((1 - toRange(r, rows)) * size[0], 50, (rows + 1) - r)"
                :fill="leaveColor((r + 1) / rows)" />
            <circle r="1" fill="red" />
        </g>
    </g>
</template>

<script lang="ts" setup>
import { computed, unref } from 'vue';

const props = withDefaults(defineProps<{
    size: [number, number]
}>(), {
    size: () => [100, 100]
})
const { abs, pow, random, min, round, max, floor, cos, sin } = Math;

const trunkWidth = 0.2
const leaves = 20
const rows = 20;

const center = computed(() => props.size.map(e => e / 2) as [number, number])

const toBreath = (i: number, d: number) => 1 - (toRange(i, d) * 2)

const toRange = (i: number, d: number) => ((i * 1.0) / (d * 1.0))

const forN = (n: number) => new Array(n).fill(0)

const leafPath = (w: number, h: number, s: number = 1) => {

    const points = forN(s)
        // For n segments
        .flatMap((_, _s, sarr) => {
            return forN(5).map((_, i, arr) => {
                const offset = ((i) % 2) ? 0.5 : 1
                return [
                    (-1 * cos(((toRange(i, (arr.length * 2) - 2)) * Math.PI * 2)) * (1 / s) * offset + ((_s / s) * 2)),
                    sin((toRange(i, (arr.length * 2) - 2) * Math.PI * 2)) * (1 / s) * offset
                ]

            })

        }).concat(...forN(s).map((_, _s, sarr) => {
            return forN(5).map((_, i, arr) => {
                const offset = ((i) % 2) ? 0.5 : 1
                return [
                    cos(((toRange(i, (arr.length * 2) - 2)) * Math.PI * 2)) * (1 / s) * offset + ((((s - 1) - _s) / s) * 2),
                    sin((toRange(i, (arr.length * 2) - 2) * Math.PI * 2)) * (-1 / s) * offset
                ]

            })
        }))
    const maxP = points.reduce((a, b) => ([max(a[0], b[0]), max(a[1], b[1])]), [0, 0])
    const minP = points.reduce((a, b) => ([min(a[0], b[0]), min(a[1], b[1])]), maxP)
    const normDiv = [maxP[0] - minP[0], maxP[1] - minP[1]]
    console.log(normDiv, minP, maxP)
    const normalized = points.map(e => e.map((e, i) => ((!i ? ((e - minP[i]) - (normDiv[i] / 2)) : e) / normDiv[i]))).map(e => e.map((q, i) => q * [w, h][i]))

    var d = `M ${normalized.shift()?.join(',')}`
    d = [d, ...normalized.map(e => `L ${e.join(',')}`)].join(' ')
    return d
}

const leaveColor = (d: number) => `#00${round(255 * d).toString(16).padStart(2, '0')}00`

</script>