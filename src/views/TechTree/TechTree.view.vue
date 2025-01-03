<template>
    <div draggable="true" class="w-screen m-auto min-h-56" @dragend="handleDragEnd" @drop="handleDragEnd"
        @dragleave="handleDragEnd" @dragstart.prevent="handleDragStart" @mouseup="handleDragEnd"
        @wheel.prevent="handleZoom" @mousemove.capture="handleDrag">
        <div class="fixed h-screen w-screen"
            :style="{ backgroundImage: `URL(${techTreeStore.backdropImage})`, ...offsetStyle }">
            <div v-for="element in techTreeStore._elements"
                class="absolute flex flex-col justify-center text-center gap-2" :style="elementOffsetStyles(element)">
                <img class="rounded-full p-5 border border-highlight bg-background2" :src="element.icon" />
                <span>{{ element.title }}</span>
            </div>
        </div>
        <div class="bottom-0 left-0 absolute">
            {{ techTreeStore._zoom.toFixed(2) }} [{{ offsetValues.map(e => (e / 100).toFixed(2)).join(', ') }}]
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useTechTreeStore, type TreeElement } from '@/stores/TechTree.store';
import { computed, onBeforeMount, ref } from 'vue';

const techTreeStore = useTechTreeStore()

onBeforeMount(() => {
    techTreeStore.initCanvas()
})

const dragStart = ref<[number, number]>()
const dragDelta = ref([0, 0])

const handleZoom = (event: Event) => {
    const e = <WheelEvent>event
    techTreeStore.updateZoom((e.deltaY / 500))
}

const handleDragStart = (event: Event) => {
    const e = <DragEvent>event
    dragStart.value = [e.clientX, e.clientY];
}


const handleDragEnd = (event: Event) => {
    dragStart.value = undefined
    techTreeStore.updateLocation(dragDelta.value)
    dragDelta.value = [0, 0]
}

const handleDrag = (event: Event) => {
    if (!dragStart.value) return
    const e = <MouseEvent>event
    const delta = [e.clientX, e.clientY].map((e, i) => dragStart.value![i] - e)
    dragDelta.value = delta
}

const offsetValues = computed(() => techTreeStore.offsets(dragDelta.value))

const elementOffsetStyles = (element: TreeElement) => {
    return Object.fromEntries(offsetValues.value.map((e, i) => [['left', 'top'][i], `${element.position[i] + e}px`]))
}

const offsetStyle = computed(() => ({
    backgroundPosition: techTreeStore.offsets(dragDelta.value).map((e, i) => `${e}px`).join(' '),
    backgroundSize: (techTreeStore._zoom * 100) + 'px'
}))


</script>