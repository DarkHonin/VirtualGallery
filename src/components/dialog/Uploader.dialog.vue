<template>
    <BaseDialog>
        <template v-slot:actions>
            <BaseButton color="positive" :loading="uploading" label="Begin" @click="begin" v-if="!allDone" />
            <BaseButton color="positive" :loading="uploading" label="Insert" @click="handleSubmit" v-else />
        </template>
        <template v-slot="">
            <div class="w-full flex gap-2 flex-wrap items-stretch">
                <div v-for="upload in uploads" :key="upload.name"
                    class="w-60 max-h-60 overflow-hidden border-2 p-2 flex flex-col group">
                    <span>{{ upload.name }}</span>
                    <img :src="toImgSrc(upload.file)" class="max-w-60 max-h-40 mt-auto mx-auto" />

                    <div class="w-full  h-6 bg-background relative flex">
                        <div class="group-hover:block hidden absolute bottom-full p-2">
                            <BaseButton color="negative" @click="removeUpload(upload)">
                                <BaseIcon name="delete" />
                            </BaseButton>

                        </div>
                        <div class="absolute w-full h-full -z-0"
                            :class="{ 'bg-positive': upload.isDone, 'bg-negative': upload.isFailed, 'bg-warning': upload.isRunning }"
                            :style="{ right: `${100 - upload.progress}%` }">
                        </div>
                        <span class="z-10 m-auto">
                            {{ upload.progress.toFixed(2) }}%
                        </span>
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
import { useActivePostEntry } from '@/db/post.model';

const props = defineProps<{
    files: File[],
    folder: string
}>()

const uploads = toRef(props.files.map((file) => ({
    name: file.name,
    file: file,
    progress: 0,
    isDone: false,
    isFailed: false,
    isRunning: false
})))

const allDone = computed(() => !uploads.value.some(e => !e.isDone))

const toImgSrc = (f: File) => {
    return URL.createObjectURL(f)
}
const { entry } = useActivePostEntry()


const uploading = ref(false)

const begin = async () => {
    uploading.value = true
    console.log(props.folder)

    for (var i = 0; i < uploads.value.length; i++) {

        await uploadFileAsync('uploads', `${props.folder}/${uploads.value[i].name}`, uploads.value[i].file,
            (bytesUploaded: number, bytesTotal: number) => {
                uploads.value[i].isRunning = true
                uploads.value[i].progress = ((bytesUploaded / bytesTotal) * 100)
            },
            (err) => {
                uploads.value[i].isFailed = true
                uploads.value[i].isRunning = false
                console.log(err)
            }, () => {
                uploads.value[i].isRunning = false
                uploads.value[i].isDone = true
                entry.value?.media.push(uploads.value[i].name)
            })
    }

    uploading.value = false
}

const handleSubmit = () => {
    submitDialog(uploads.value.filter(e => !e.isFailed).map(e => e.name))
}

const { submitDialog, closeDialog } = useDialogControls()

const removeUpload = (upload: { name: string }) => {
    console.log(upload)
    console.log(uploads)
    uploads.value = uploads.value.filter(e => e.name != upload.name)
    if (!uploads.value.length) closeDialog()

}

</script>