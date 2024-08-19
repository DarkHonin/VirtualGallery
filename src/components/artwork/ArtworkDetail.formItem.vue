<template>
    <div>
        <BaseInput label="Title" :modelValue="artwork.title" @update:model-value="handleUpdate('title', $event)" />
        <TextareaInput label="Description" :model-value="artwork.description"
            @update:model-value="handleUpdate('description', $event)" />
    </div>
</template>

<script setup lang="ts">
import type { Artwork } from '@/db/artwork.model';
import BaseInput from '../input/Base.input.vue';
import TextareaInput from '../input/Textarea.input.vue';


const props = defineProps<{
    artwork: Artwork
}>()

const emit = defineEmits<{
    (e: 'update:artwork', artwork: Artwork): void
}>()

const handleUpdate = (field: keyof Artwork, value: any) => {
    console.log("Emit")
    emit('update:artwork', { ...props.artwork, [field]: value })
}

</script>