<template>
    <BaseInput v-bind="props" class="select-input">
        <template #control="{}">
            <label class="bg-label-primary border-r-2 flex relative" tabindex="0">
                <slot name="display"
                    v-bind="{ item: options.filter(e => selected.includes(item_value ? e[item_value] : e)) }">

                    <label>{{ options.filter(e => selected.includes(item_value ? e[item_value] : e)) }}</label>
                </slot>
                <BaseIcon name="chevron_left" class="ml-auto z-10" />
                <KeepAlive>
                    <label class="options absolute top-full left-0 bg-primary max-h-56 overflow-y-auto  w-full">
                        <template v-for="i, k in options" :key="k">
                            <div class="hover:bg-primary-hover p-2 cursor-pointer options"
                                :class="{ active: selected.includes(item_value ? i[item_value] : i) }" tabindex="0">
                                <component :is="slots.item"
                                    v-bind="{ item: i, addItem, removeItem, isSelected: selected.includes(item_value ? i[item_value] : i) }"
                                    v-if="slots.item" />
                                <div v-else @click="selected.includes(i) ? removeItem(i) : addItem(i)">
                                    {{ i }}
                                </div>
                            </div>

                        </template>
                    </label>
                </KeepAlive>
            </label>
        </template>
    </BaseInput>
</template>

<script lang="ts" setup>
import BaseIcon from '../icon/Base.icon.vue';
import BaseInput from './Base.input.vue';
import { type BaseInputProps, type SelectInputProps } from './input.types'
import { computed } from 'vue'
const props = withDefaults(defineProps<SelectInputProps>(), {
    type: () => 'select'
})

const emit = defineEmits<{
    (e: 'update:modelValue', updateValue: any): void
}>()

const slots = defineSlots<{
    display(props: { item: any[] }): void,
    item(props: { item: any, addItem: { (i: any): void } }): void,
}>()



const addItem = (e: any) => {
    console.log(e)
    if (props.multiple) {
        if (!props.modelValue)
            emit("update:modelValue", [props.item_value ? e[props.item_value] : e])
        else if (typeof (props.modelValue) !== 'string' && (<Array<any>>props.modelValue).length) {
            emit("update:modelValue", [...(<Array<any>>props.modelValue), props.item_value ? e[props.item_value] : e])
        }

    } else {
        emit("update:modelValue", props.item_value ? e[props.item_value] : e)
    }
}

const removeItem = (e: any) => {
    if (props.multiple) {
        if (!props.modelValue)
            return emit('update:modelValue', [])
        if (typeof (props.modelValue) !== 'string' && (<Array<any>>props.modelValue!).length) {
            return emit("update:modelValue", (<Array<any>>props.modelValue).filter(a => a !== e))
        }
    }
    emit("update:modelValue", undefined)
}

const selected = computed(() => {
    if (!props.modelValue) return []
    if (props.multiple) {
        if (typeof (props.modelValue) !== 'string' && typeof ((<Array<any>>props.modelValue).length) !== 'undefined') {
            return (<Array<any>>props.modelValue)
        }
    }
    return [props.modelValue]
})


</script>

<style lang="scss">
.select-input {
    .options {
        display: none;
    }


    &:has(:focus),
    &:has(:focus-within) {
        .options {
            display: block;
        }
    }
}
</style>