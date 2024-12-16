<template>
    <SpinnerLoader class="m-auto" :loading="postsStore.isActing" :message="postsStore.activeActions.join(' ')">
        <div class="flex-1 flex flex-col gap-2" v-if="postsStore.posts">
            <RouterLink v-for="post in filteredPosts" :key="post.id" :to="postView(post.id)">
                <PostCardBase :post="post" />
            </RouterLink>
        </div>
        <div v-else class="text-center">
            ...Theres nothing here...
        </div>

    </SpinnerLoader>

</template>

<script lang="ts" setup>
import { postView } from '@/router/routes';
import { usePostsStore } from '@/stores/Posts.store';
import { computed, onMounted } from 'vue';
import PostCardBase from '../PostCard.base.vue';
import SpinnerLoader from '@/components/loader/Spinner.loader.vue';


const postsStore = usePostsStore()

const props = defineProps<{
    filter?: string
}>()

const filteredPosts = computed(() => {
    return postsStore.posts?.filter(opt => {
        return opt.title.toLowerCase().includes(props.filter?.toLowerCase() ?? "")
    })
})

onMounted(() => {
    postsStore.getPosts()
})

</script>