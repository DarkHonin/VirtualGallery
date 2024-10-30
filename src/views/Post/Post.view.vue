<template>

    <div class="p-2 flex flex-col place-content-start w-full bg-background2 m-auto post-view"
        style="width: 768px; max-width: 100vw;" ref="root">
        <SpinnerLoader class="m-auto min-h-full" :loading="blogStore.isActing" message="Loading post">
            <template #default>
                <template v-if="!post">
                    Could not find post
                </template>
                <template v-else>
                    <h1 class="m-8"><span>{{ post.title }}</span><span class="text-sm block">{{ publicationDate
                            }}</span></h1>
                    <hr>
                    <div v-html="post.content" class="pb-8 markup"></div>
                    <div class="absolute left-0 top-0 w-full -z-10 opacity-0 transition-all md:block hidden"
                        style="transition-duration: 1s;" :class="{ 'opacity-100': Boolean(scrollHeightDivision) }">
                        <div v-for="i in media"
                            :style="{ backgroundImage: `URL(${i.url})`, minHeight: `${scrollHeightDivision}px` }"
                            class="w-full bg-fixed bg-center bg-cover" style="filter: blur(5px) brightness(20%);"
                            :key="i.name">

                        </div>
                    </div>
                </template>

            </template>
        </SpinnerLoader>
    </div>
</template>

<script lang="ts" setup>
import SpinnerLoader from '@/components/loader/Spinner.loader.vue';
import { useActivePost, usePost, type Post } from '@/db/post.model';
import PostEditService from '@/services/Post.service';
import { useBlogStore } from '@/stores/Blog.store';
import { usePostStore } from '@/stores/Post.store';
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const blogStore = useBlogStore()

const route = useRoute()
const postId = computed(() => parseInt(route.params.postId as string))
const { media, coverImage, lastUpdate, publicationDate, post } = usePost(computed(() => blogStore.active))

const root = ref<HTMLElement>()

onMounted(async () => {
    window.addEventListener("resize", handleResize)
    try {
        blogStore.loadPost(postId.value).then(() => {
            setTimeout(handleResize, 1000)
        })
    } catch (e) {
        error.value = e
        console.error(e)
    }
})

onBeforeUnmount(() => {
    window.removeEventListener("resize", handleResize)
})

const handleResize = () => {
    scrollHeightDivision.value = (root.value?.getBoundingClientRect().height ?? 0) / media.value.length
}


const scrollHeightDivision = ref(0)


const error = ref()




</script>

<style lang="scss">
.post-view {
    box-shadow: 0px 0px 10px 0px black;
}
</style>