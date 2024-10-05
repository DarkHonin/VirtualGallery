<template>
    <div class="flex flex-col gap-2 post-content">
        <BaseInput label="Post Title" :modelValue="post.title" @update:model-value="handleUpdate('title', $event)" />
        <div class="flex justify-between">
            <label for="content" :class="{ 'bg-background2': view == 'content' }"
                class=" select-none flex justify-between items-center cursor-pointer">
                <span>Content</span>
                <input hidden id="content" type="radio" name="view" value="content"
                    @click="view = $event.target.value" />
            </label>

            <label for="preview" :class="{ 'bg-background2': view == 'preview' }"
                class="select-none flex justify-between items-center cursor-pointer">
                <span>Preview</span>
                <input hidden id="preview" type="radio" name="view" value="preview"
                    @click="view = $event.target.value" />
            </label>

        </div>
        <TextareaInput v-if="view == 'content'" ref="contentInput" class="h-min"
            @update:model-value="handleUpdate('content', $event)" :model-value="post.content" style="color: black" />


        <template v-if="view == 'preview'">
            <div class="p-2 border-background2 border" v-if="markup" v-html="markup">

            </div>
            <SpinnerLoader class="m-auto" v-else :loading="true" />

        </template>

    </div>
</template>

<script setup lang="ts">
import type { Post } from '@/db/post.model';
import BaseInput from '../input/Base.input.vue';
import TextareaInput from '../input/Textarea.input.vue';
import { onMounted, ref, watch, watchEffect } from 'vue';
import PostService from '@/services/PostEdit.service';
import BaseIcon from '../icon/Base.icon.vue';
import SpinnerLoader from '../loader/Spinner.loader.vue';

const contentInput = ref<typeof TextareaInput>()

const view = ref("content")

const props = defineProps<{
    post: Post,
    markup?: string
}>()

const emit = defineEmits<{
    (e: 'update:post', post: Post): void
}>()

const handleUpdate = (field: keyof Post, value: any) => {
    emit('update:post', { ...props.post, [field]: value })
}

var timeout: NodeJS.Timeout | undefined = undefined

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