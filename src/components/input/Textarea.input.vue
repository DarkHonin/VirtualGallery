<template>
    <BaseInput ref="root" v-bind="props" type="textarea" @mouseleave="widgetOffset = undefined"
        @update:model-value="emit('update:modelValue', $event as string)" class="text-area-input w-full">
        <template #control="{ handleUpdate }">
            <div class="flex justify-stretch items-stretch">

                <div class="grow-wrap flex-1" :replicated-value="modelValue">
                    <textarea @contextmenu.prevent="handleInsertRequest" class="bg-background2" ref="TextArea"
                        :placeholder="placeholder" @input="handleUpdate($event)">{{ modelValue }}</textarea>
                </div>
                <div v-html="processedMarkup" style="color: white"
                    class=" flex-1 p-2 border-background2 border-2 markup">
                </div>
                <div class="absolute p-2 z-50 " style="color: white" ref="widget"
                    :style="{ display: widgetOffset ? 'block' : 'none', ...(widgetOffset ?? {}) }"
                    contenteditable="false">
                    <div class="p-2 border border-4 border-primary bg-background rounded flex items-center">
                        <BaseIcon name="image" size="md" class="p-1 cursor-pointer" @click="addMedia" />
                    </div>
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
import { toMarkdown as toMarkdown, toMarkup } from '@/utils/mark';
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
const widget = ref<HTMLElement>()

const widgetOffset = ref()



const processedMarkup = computed(() => {
    const ret = toMarkup(props.modelValue as string ?? "", postMedia.value ?? {})
    return ret

})

const handleInsertRequest = (event: Event) => {
    const { clientX, clientY } = (event as MouseEvent)

    if (!widget.value) return

    const { width, height } = widget.value.getBoundingClientRect()

    widgetOffset.value = {
        left: `${clientX}px`,
        top: `${clientY}px`
    }
}



const route = useRoute()

const postId = computed(() => parseInt(route.params.postId as string))

const postMedia = computed(() => mediaStore.media(postId.value))
const mediaStore = useMediaStore()


const addMedia = () => {

    const input = document.createElement('input')
    input.addEventListener('change', () => {
        if (!input.files?.length) return
        const name = mediaStore.registerMedia(postId.value, input.files[0])
        injectImage(name)
        widgetOffset.value = undefined
    })
    input.setAttribute('type', "file")
    input.click()
}

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