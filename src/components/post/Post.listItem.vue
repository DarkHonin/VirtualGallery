<template>
    <div class="group artwork-list-item flex w-full grow gap-2 min-w-32 border"
        :class="{ 'border-2 border-accent border-dashed hover:border-primary-active': !Boolean(item), 'border-primary  hover:border-accent': Boolean(item) }">
        <SpinnerLoader v-if="item" :loading="!post">
            <div :style="{ backgroundImage: `URL(${artworkURL})` }" class="aspect-square bg-cover bg-center flex ">

                <div
                    class="p-2 w-full mt-auto bg-opacity-90 group-hover:bg-opacity-100 transition-all bg-primary cursor-pointer">
                    <label class="cursor-pointer">{{ item.title }}</label>
                </div>

            </div>
        </SpinnerLoader>


        <BaseIcon v-else class="m-auto scale-150" name="add" />

    </div>
</template>

<script lang="ts" setup>
import { usePost as usePost, type Post, type PostPreview } from '@/db/post.model';
import { computed, onMounted, ref } from 'vue';
import BaseIcon from '../icon/Base.icon.vue';
import PostService from '@/services/PostEdit.service';
import BaseLoader from '../loader/Base.loader.vue';
import SpinnerLoader from '../loader/Spinner.loader.vue';



const props = defineProps<{
    item?: Post
}>()

const post = ref<Post>()

onMounted(() => {
    if (props.item)
        PostService.readPost(props.item).then(p => post.value = p)
})


const artworkURL = computed(() => {
    if (!props.item) return undefined
    const { media } = usePost(props.item)
    if (!media.value?.length) return ""
    return media.value[0].url
})


</script>