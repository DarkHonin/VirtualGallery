<template>
    <div class="p-2 bg-background2 flex flex-col gap-2">
        <div class="flex gap-2 items-center w-full">
            <BaseInput v-model="entry!.title" class="flex-1" placeholder="Entry title"
                :disable="postEditStore.isActionActive('saveEntry') || loadingMarkdown" />
            <BaseButton :loading="postEditStore.isActionActive('saveEntry')" :disabled="loadingMarkdown">
                <BaseIcon name="save" @click="handleEntrySave" />
            </BaseButton>
        </div>
        <SpinnerLoader :loading="loadingMarkdown" class="flex flex-col gap-2 m-auto">
            <div class="flex">
                <BaseButton :disabled="postEditStore.isActing" v-for="cb, key in markdownEditButtons" :key="key"
                    @click="cb()">
                    <BaseIcon :name="key" />
                </BaseButton>
            </div>
            <div class="grow-wrap relative" :replicated-value="markdown" @dragover.prevent="isDragOver = true"
                @dragleave.prevent="isDragOver = false" @drop.prevent="handleFileUploadDrop">
                <textarea :disabled="postEditStore.isActing" class="w-full p-2 resize-none" ref="textarea"
                    @input="markdown = (<HTMLInputElement>$event.target).value">{{ markdown }}</textarea>

                <div class="absolute w-full h-full flex bg-primary p-2" :class="{ 'hidden': !isDragOver }">
                    <div class="m-auto w-full h-full border-2 border-dashed flex">
                        <div class="m-auto">
                            Upload
                        </div>
                    </div>
                </div>
            </div>
        </SpinnerLoader>
    </div>
</template>

<script lang="ts" setup>
import { type NormalizedPostEntry, type PostEntry, useActivePostEntry } from '@/db/post.model';
import BaseInput from '../input/Base.input.vue';
import { computed, ref, type Ref } from 'vue';
import BaseButton from '../button/Base.button.vue';
import BaseIcon from '../icon/Base.icon.vue';
import { usePostEditStore } from '@/stores/PostEditor.store';
import SpinnerLoader from '@/components/loader/Spinner.loader.vue';
import { uploadFileAsync } from '@/utils/asyncFileUpload';
import { openDialog } from '@/utils/Dialog.compose';
import UploaderDialog from '../dialog/Uploader.dialog.vue';
import InsertDialog from '../dialog/Insert.dialog.vue';

const markdownEditButtons = {
    'image': () => {
        const dialog = openDialog(InsertDialog)
        dialog.onSubmit((insert: string[]) => {
            const pos = textarea.value?.selectionStart || 0
            textarea.value!.value = textarea.value!.value.slice(0, pos) + insert.map(e => `![${e}](${e})`).join('\n') + textarea.value!.value.slice(pos)
            textarea.value!.dispatchEvent(new InputEvent('input'))
        })
    },
}

const isDragOver = ref(false)

const postEditStore = usePostEditStore()
const textarea = ref<HTMLTextAreaElement>()

const handleFileUploadDrop = (event: Event) => {
    event.preventDefault()
    const e = <DragEvent>event
    isDragOver.value = false
    if (!e.dataTransfer?.items)
        return
    const files = [...e.dataTransfer.items].filter(i => i.kind == 'file').map(i => i.getAsFile())

    // activeUploads.value = files.map(file => {
    //     const fileId = crypto.randomUUID().split('-')[0]
    //     const progress = ref("0")
    //     uploadFileAsync('uploads', `${post.value?.author}/${post.value!.id}/${entry.value!.id}/${fileId}`, file!, progress)
    //     return progress
    // })

    const dialog = openDialog(UploaderDialog, { files, folder: postEditStore.postFolder })
    dialog.onSubmit((files: string[]) => {
        const pos = textarea.value?.selectionStart || 0
        textarea.value!.value = textarea.value!.value.slice(0, pos) + files.map(e => `![${e}](${e})`).join('\n') + textarea.value!.value.slice(pos)
        textarea.value!.dispatchEvent(new InputEvent('input'))
        entry.value!.media = files
    })
}

const { loadingMarkdown, markdown, entry, post } = useActivePostEntry()

const handleEntrySave = () => {
    emit('entrySaving')
    postEditStore.savePostEntry(markdown.value!)
}

const emit = defineEmits<{
    (e: "entrySaving"): void
}>()

</script>

<style lang="scss">
.grow-wrap {
    display: grid;
    height: min-content;

    &::after {
        content: attr(replicated-value) " ";
        white-space: pre-wrap;
        visibility: hidden;
        height: min-content;
    }

    textarea {
        resize: none;
        overflow: hidden;
        background: black;
    }

    textarea,
    &::after {
        padding: 0.5em;
        font: inherit;
        grid-area: 1 / 1 / 2 / 2;
        border: 1px solid black;
        font: inherit;
        color: white;
        min-height: min-content;
    }
}
</style>