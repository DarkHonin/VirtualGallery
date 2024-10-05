<template>
    <div>
        <div class=" w-60 h-32 overflow-hidden bg-center bg-cover relative" :style="{ backgroundImage: `URL(${publicUrl})` }">
            <div v-if="publicUrl" class="absolute w-full h-full flex justify-between px-2">
                <BaseButton  @click="emit('insertImage', publicUrl)">
                    <BaseIcon name="add" />
                </BaseButton>
                <BaseButton @click="emit('deleteImage', path, publicUrl)" color="negative">
                    <BaseIcon name="delete" />
                </BaseButton>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { PostStorage } from '@/db/post.model';
import { onMounted, ref } from 'vue';
import BaseButton from '../button/Base.button.vue';
import BaseIcon from '../icon/Base.icon.vue';


const props = defineProps<{
    path: string
}>()

const publicUrl = ref<string>()

const emit = defineEmits<{
    (e: 'insertImage', publicUrl: string): void,
    (e: 'deleteImage', path: string, publicUrl: string): void
}>()

onMounted(() => {
    const {data} = PostStorage().getPublicUrl(props.path)
    publicUrl.value = data.publicUrl
})


</script>