<template>
    <BaseInput v-bind="props" type="textarea" @update:model-value="emit('update:modelValue', <string>$event)">
        <template #control="{ handleUpdate }">
            <textarea :placeholder="placeholder" class="w-full resize-none min-h-40 p-1"
                @input="handleUpdate($event)">{{ modelValue }}</textarea>
        </template>
    </BaseInput>
</template>

<script setup lang="ts">
import BaseInput from './Base.input.vue'
import { type BaseInputProps } from './input.types'

const props = defineProps<BaseInputProps>()

const emit = defineEmits<{
    (e: 'update:modelValue', updateValue: string): void
}>()

</script>