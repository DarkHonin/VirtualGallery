<template>

    <UploaderDialog v-if="uploadMode" :files="uploadFileSelection" :folder="postEditStore.postFolder">

    </UploaderDialog>

    <BaseDialog v-else>
        <template v-slot:actions>
            <BaseButton color="primary" label="Upload" @click="handleUpload" />
            <BaseButton color="positive" label="Insert" @click="handleSubmit" :disabled="!selected?.length" />

        </template>
        <template v-slot="">
            <div class="w-full flex gap-2 flex-wrap items-stretch">
                <div v-for="upload in media" :key="upload.name"
                    class="w-60 max-h-60 overflow-hidden border-2 p-2 flex flex-col group  relative"
                    @click="selected!.find(e => e.name == upload.name) ? selected = selected!.filter(e => e.name != upload.name) : selected!.push(upload)">
                    <span>{{ upload.name }}</span>
                    <img :src="upload.url" class="max-w-60 max-h-40 mt-auto mx-auto" />

                    <div class="w-full h-full absolute  flex top-0 left-0 p-2">
                        <input class="w-4 h-4 ml-auto" type="checkbox"
                            :checked="Boolean(selected!.find(e => e.name == upload.name))" />
                        <!-- <div class="group-hover:block hidden absolute bottom-full p-2">
                            <BaseButton color="negative" @click="removeUpload(upload)">
                                <BaseIcon name="delete" />
                            </BaseButton>

                        </div> -->

                    </div>
                </div>
            </div>
        </template>
    </BaseDialog>
</template>

<script lang="ts" setup>
import { computed, ref, toRef } from 'vue';
import BaseButton from '../button/Base.button.vue';
import BaseDialog from '../util/Base.dialog.vue';
import { uploadFileAsync } from '@/utils/asyncFileUpload';
import { useDialogControls } from '@/utils/Dialog.compose';
import BaseIcon from '../icon/Base.icon.vue';
import { usePostEditStore } from '@/stores/PostEditor.store';
import UploaderDialog from './Uploader.dialog.vue';
import { useActivePost } from '@/db/post.model';

const postEditStore = usePostEditStore()

const { submitDialog, closeDialog } = useDialogControls()



const handleSubmit = () => {
    submitDialog(selected.value?.map(e => e.name))
}

const uploadMode = ref(false)

const uploadFileSelection = ref<File[]>([])

const { media } = useActivePost()

const selected = ref<Required<(typeof media.value)>>([])

const handleUpload = () => {

    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('multiple', 'true')
    input.addEventListener('change', () => {
        for (var i = 0; i < (input.files?.length ?? 0); i++) {
            uploadFileSelection.value.push(input.files![i])
        }
        uploadMode.value = true
    })


    input.click()

}


</script>