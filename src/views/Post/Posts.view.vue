<template>
    <RouterView>
        <template v-slot="{ Component }">
            <Content class="flex flex-col h-full gap-2">
                <component :is="Component" v-if="Component" />
                <template v-else>
                    <div class="bg-background2 p-2 gap-2 flex flex-col">
                        <div class="flex gap-2">
                            <BaseButton v-if="userStore.isSignedIn" @click="router.push(postView('new'))">
                                <BaseIcon name="add" />
                            </BaseButton>
                            <BaseButton v-if="userStore.isSignedIn" @click="handleUpload">
                                <BaseIcon name="upload" />
                            </BaseButton>
                        </div>
                        <BaseInput placeholder="Search" v-model="searchQuery" />
                    </div>

                    <PostList :filter="searchQuery" />
                </template>

            </Content>

        </template>
    </RouterView>
</template>

<script lang="ts" setup>
import BaseButton from '@/components/button/Base.button.vue';
import Content from '@/components/core/Content.vue';
import BaseIcon from '@/components/icon/Base.icon.vue';
import BaseInput from '@/components/input/Base.input.vue';
import SpinnerLoader from '@/components/loader/Spinner.loader.vue';
import PostList from '@/components/post/parts/Post.list.vue';
import PostCardBase from '@/components/post/PostCard.base.vue';
import { postView } from '@/router/routes';
import { api } from '@/services/index.service';
import { usePostsStore } from '@/stores/Posts.store';
import { useUserStore } from '@/stores/User.store';
import { formatISODate } from '@/utils/Date';

import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const userStore = useUserStore()
const postsStore = usePostsStore()

const searchQuery = ref<string>()
const router = useRouter()

onMounted(() => {
    postsStore.getPosts()
})

const route = useRoute()

watch(() => <string>route.params.postId, (nv, ov) => {
    console.log(nv, ov)
    if (nv == 'new') return postsStore._activePost = undefined
    const postId = parseInt(nv)
    if (!isNaN(postId)) postsStore.getPost(postId)

})

const handleUpload = () => {
    const formData = new FormData()
    const input: HTMLInputElement = Object.assign(document.createElement('input'), {
        type: "file",
        accept: "application/zip"
    })

    input.addEventListener("change", async () => {

        formData.append("file", input.files![0])
        const status = await api('upload', formData)
        postsStore.getPosts()
    })

    input.click()

}


</script>