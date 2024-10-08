<template>
    <div class="flex flex-col gap-2 post-content">
        <BaseInput label="Post Title" :modelValue="post.title" @update:model-value="handleUpdate('title', $event)" />
        <div class="flex flex-col">
            <div class="overflow-x-auto flex" style="max-width: 800px;">
                <div v-for="m, i in postMedia" :key="i"
                    class="group w-52 h-52 inline-block min-w-52 bg-contain bg-center bg-no-repeat"
                    :style="`background-image: URL(${m});`">
                    <div
                        class="group-hover:flex hidden w-full h-full bg-background2 bg-opacity-35 justify-center items-center gap-2">
                        <BaseButton @click="contentInput?.injectImage(i)">
                            <BaseIcon name="step_into" />
                        </BaseButton>
                        <BaseButton color="negative" @click="contentInput?.removeImage(i)">
                            <BaseIcon name=" delete" />
                        </BaseButton>
                    </div>
                </div>
            </div>
            <TextareaInput ref="contentInput" class="h-min" @update:model-value="handleUpdate('content', $event)"
                :model-value="post.content" style="color: black" />

        </div>

    </div>
</template>

<script setup lang="ts">
import type { Post } from '@/db/post.model';
import BaseInput from '../input/Base.input.vue';
import TextareaInput from '../input/Textarea.input.vue';
import { computed, onMounted, ref } from 'vue';
import { useMediaStore } from '@/stores/Media.store';
import BaseButton from '../button/Base.button.vue';
import BaseIcon from '../icon/Base.icon.vue';

const contentInput = ref<typeof TextareaInput>()

const view = ref("content")

const props = defineProps<{
    post: Post,
    markup?: string
}>()

const postMedia = computed(() => useMediaStore().media(props.post.id ?? 'NaN'))


const emit = defineEmits<{
    (e: 'update:post', post: Post): void
}>()

const handleUpdate = (field: keyof Post, value: any) => {
    emit('update:post', { ...props.post, [field]: value })
}


defineExpose({
    insertContent: (txt: string) => {
        if (!contentInput.value) return
        console.log(txt)
        contentInput.value.injectText(txt)
    }
})

</script>

<style lang="scss">
.post-content {
    width: auto;
    flex: 1
}
</style>