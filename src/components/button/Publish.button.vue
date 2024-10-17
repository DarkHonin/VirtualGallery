<template>
    <div class="flex gap-2 relative items-center" ref="publishRoot">
        <BaseButton color="negative" v-if="isPublished" @click="emit('update:publishString', null)">
            Unpublish
        </BaseButton>
        <template v-if="!publishDate || isScheduled">
            <BaseButton color="positive">
                Publish {{ isScheduled ? 'now' : '' }}
            </BaseButton>
            <BaseButton color="primary" @click="openInput">
                {{ isScheduled ? 'Change' : 'Schedule' }}
            </BaseButton>
            <input ref="dateInput" type="date" hidden :value="publishString" class="relative"
                @input="handleDateTimeChange" />
        </template>
        {{ publishDate?.toLocaleDateString() }}
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import BaseButton from './Base.button.vue';
import BaseInput from '../input/Base.input.vue';

const publishRoot = ref<HTMLElement>()
const dateInput = ref<HTMLInputElement>()

const props = defineProps<{
    publishString?: string
}>()

const publishDate = computed(() => props.publishString ? new Date(props.publishString) : undefined)
const nowDate = computed(() => new Date(Date.now()))

const isPublished = computed(() => publishDate.value ? publishDate.value <= nowDate.value : false)
const isScheduled = computed(() => publishDate.value ? publishDate.value > nowDate.value : false)

const openInput = () => {
    if (!dateInput.value) return alert("Input not ready")
    dateInput.value.showPicker()
}

const emit = defineEmits<{
    (e: "update:publishString", newString: string | null): void
}>()

const handleDateTimeChange = () => {
    if (!dateInput.value) return alert("Input not ready")
    emit("update:publishString", new Date(Date.parse(dateInput.value.value)).toISOString())
}


</script>