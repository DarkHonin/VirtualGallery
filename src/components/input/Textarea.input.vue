<template>
    <BaseInput ref="root" v-bind="props" type="textarea" @mouseleave="widgetOffset = undefined"
        @update:model-value="emit('update:modelValue', $event as string)" class="text-area-input w-full">
        <template #control="{ handleUpdate }">
            <div class="flex justify-stretch items-stretch">

                <div class="grow-wrap flex-1" :replicated-value="modelValue">
                    <textarea class="bg-background2" ref="TextArea" :placeholder="placeholder"
                        @input="handleUpdate($event)">{{ modelValue }}</textarea>
                </div>
                <div v-html="processedMarkup" style="color: white"
                    class=" flex-1 p-2 border-background2 border-2 markup edit">
                </div>

            </div>
        </template>
    </BaseInput>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import BaseInput from './Base.input.vue'
import { type BaseInputProps } from './input.types'
import BaseIcon from '../icon/Base.icon.vue';
import { parseMarkdown, } from '@/utils/mark';
import { useMediaStore } from '@/stores/Media.store';
import { useRoute } from 'vue-router';



const props = defineProps<BaseInputProps>()

const emit = defineEmits<{
    (e: 'update:modelValue', updateValue: string): void
}>()

const TextArea = ref<HTMLTextAreaElement>()
const injectImage = (name: string) => {
    if (!TextArea.value) {
        console.error("Could not write to text area as its not mounted yet")
        console.trace()
        return
    }

    TextArea.value.focus()
    const loc = TextArea.value.selectionStart
    const before = TextArea.value.value.slice(0, loc)
    const after = TextArea.value.value.slice(loc + 1)

    TextArea.value.value = `${before}\n![alt Text](${name})\n${after}`
    emit("update:modelValue", TextArea.value.value)
}

const removeImage = (name: string) => {
    if (!TextArea.value) {
        console.error("Could not write to text area as its not mounted yet")
        console.trace()
        return
    }

    let temp = TextArea.value.value
    let m: RegExpExecArray | undefined | null = undefined
    const rex = new RegExp(
        /(\n)?!\[(?<alt_text>.+?)\]\((?<src>.+?)(\s*\|\s*(?<width>\d+))?(\n&)?\)/mg,
    )
    while ((m = rex.exec(temp))) {
        console.log(m)
        if (m.groups?.src == name)
            temp = temp.replace(m[0], '')
    }

    mediaStore.removeMedia(postId.value, name)

    TextArea.value.value = temp
    emit("update:modelValue", TextArea.value.value)
}

defineExpose({
    injectImage,
    removeImage
})

const root = ref<HTMLElement>()


const widgetOffset = ref()



const processedMarkup = computed(() => {
    const ret = parseMarkdown(props.modelValue as string ?? "")
    return ret

})

const route = useRoute()

const postId = computed(() => parseInt(route.params.postId as string))

const mediaStore = useMediaStore()




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