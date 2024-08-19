<template>
    <BaseInput v-bind="props" class="h-min min-w-48 flex-col flex">
        <template #control="{ handleUpdate }">
            <div v-if="!(preview || modelValue)"
                class="grow border-dashed border border-primary-active hover:border-primary-hover text-primary-active hover:text-primary-hover w-full h-40 flex cursor-pointer">
                <BaseIcon name="add" class="m-auto" />
            </div>
            <img v-else :src="previewUrl" class="cursor-pointer" />
            <input type="file" accept="Image/png;Image/jpeg" hidden @change="handleFileSelect">
        </template>
    </BaseInput>
</template>

<script setup lang="ts">
import { computed, ref, unref } from 'vue';
import BaseIcon from '../icon/Base.icon.vue';
import BaseInput from './Base.input.vue';
import type { ImageInputProps } from './input.types';

const props = withDefaults(defineProps<ImageInputProps>(), {
    type: () => 'image'
})

const emit = defineEmits<{
    (e: "update:modelValue", file: File): void
}>()

const preview = ref<File>()

const handleFileSelect = (e: Event) => {
    const target = <HTMLInputElement>e.target
    const files = target.files
    if (!files) return preview.value = undefined
    preview.value = files[0];

    emit('update:modelValue', preview.value);
};

const previewUrl = computed(() => (preview.value ? URL.createObjectURL(preview.value) : undefined) ?? (props.modelValue instanceof File ? URL.createObjectURL(props.modelValue) : props.modelValue))

</script>