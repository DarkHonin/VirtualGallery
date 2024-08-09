<template>
    <label class="base-input">
        <div class="base-input__label text-label-primary py-2 underline" v-if="label || $slots.label">
            <slot name="label">{{ label }}</slot>
        </div>
        <div class="base-input__control text-input-primary ">
            <slot name="control" v-bind="{ handleUpdate }">
                <input class="px-2 invalid:border-red-500 w-full" :type="mappedType" :required="required"
                    :placeholder="placeholder" :value="modelValue" @input="handleUpdate" />
            </slot>
        </div>
    </label>
</template>

<script setup lang="ts">
import { type BaseInputProps } from './input.types'
import { computed } from 'vue'
const props = withDefaults(defineProps<BaseInputProps>(), {
    type: () => 'text'
})

const emit = defineEmits<{
    (e: 'update:modelValue', updateValue: number | string): void
}>()

const mappedType = computed(() => {
    const type = props.type
    switch (type) {
        case "float":
        case "int":
            return 'number'
        default:
            return type
    }
})

const handleUpdate = (e: Event) => {
    const target = <HTMLInputElement>e.target
    const type = props.type
    const preParse = target.value
    switch (type) {
        case "float":
            return emit('update:modelValue', parseFloat(preParse))
        case "int":
            return emit('update:modelValue', parseInt(preParse))
        default:
            emit('update:modelValue', preParse)
    }
}

</script>