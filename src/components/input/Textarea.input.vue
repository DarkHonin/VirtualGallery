<template>
    <BaseInput v-bind="props" type="textarea" @update:model-value="emit('update:modelValue', $event as string)"
        class="text-area-input">
        <template #control="{ handleUpdate }">
            <div class="grow-wrap" :replicated-value="modelValue">
                <textarea class="bg-background2" ref="TextArea" :placeholder="placeholder"
                    @input="handleUpdate($event)">{{ modelValue }}</textarea>
            </div>
        </template>
    </BaseInput>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BaseInput from './Base.input.vue'
import { type BaseInputProps } from './input.types'

const props = defineProps<BaseInputProps>()

const emit = defineEmits<{
    (e: 'update:modelValue', updateValue: string): void
}>()

const TextArea = ref<HTMLTextAreaElement>()

defineExpose({
    injectText: (txt: string) => {
        if (!TextArea.value) {
            console.error("Could not write to text area as its not mounted yet")
            console.trace()
            return
        }

        TextArea.value.focus()
        const loc = TextArea.value.selectionStart
        const before = TextArea.value.value.slice(0, loc)
        const after = TextArea.value.value.slice(loc + 1)

        TextArea.value.value = `${before}${txt}${after}`
        emit("update:modelValue", TextArea.value.value)
    }
})

</script>

<style lang="scss">
.text-area-input {
    .grow-wrap {
        display: grid;

        &::after {
            content: attr(replicated-value) " ";
            white-space: pre-wrap;
            visibility: hidden;
            height: min-content;
        }

        textarea {
            resize: none;
            overflow: hidden;
        }

        textarea,
        &::after {
            padding: 0.5rem;
            font: inherit;
            grid-area: 1 / 1 / 2 / 2;
            border: 1px solid black;
            font: inherit;
            color: white
        }
    }

}
</style>