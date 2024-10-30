<template>
    <div v-if="isNotFound" class="px-2 w-full flex flex-col justify-center items-center">
        <BaseIcon name="error" class="text-button-negative" />
        <h2>
            Could not find post
        </h2>
    </div>
    <div v-else class="p-2 flex flex-col place-content-start w-full h-min min-h-min overflow-visible">
        <div class="flex gap-2 h-10 w-full mx-auto h-10" style="width: 800px;">
            <BaseButton color="positive" label="Save" :disabled="!activePost.title" :loading="postStore.isActing"
                @click="save()" />
            <BaseButton v-if="activePost.id" color="negative" label="Delete" :disabled="!activePost.id"
                :loading="postStore.isActing" @click="deleteArt()" />

            <label v-show="postStore.isActing" class="m-auto items-center flex gap-2">
                <p>{{ postStore.activeActions.join(' - ') }}
                </p>
                <SpinnerLoader :loading="true" size="xs" />
            </label>
            <PublishButton class="ml-auto" :publish-string="activePost.publish ?? undefined"
                @update:publish-string="(nv: string | null) => { activePost.publish = nv; save() }" />
        </div>


        <PostEditFormItem ref="postContent" v-model:post="activePost" :markup="postStore._markup" />



    </div>

</template>

<script setup lang="ts">

import { computed, ref } from 'vue'
import { useActivePost, type Post } from "@/db/post.model"
import { usePostStore } from "@/stores/Post.store"
import { useRoute, useRouter } from 'vue-router'
import BaseButton from '@/components/button/Base.button.vue'
import SpinnerLoader from '@/components/loader/Spinner.loader.vue'
import BaseIcon from '@/components/icon/Base.icon.vue'

import { post, posts } from '@/router/routes'
import PostEditFormItem from '@/components/post/PostEdit.formItem.vue'
import { useUserStore } from '@/stores/User.store'
import PublishButton from '@/components/button/Publish.button.vue'

const postStore = usePostStore()
const route = useRoute()

const router = useRouter()
const userStore = useUserStore()

const { activePost } = useActivePost()

const imageUpload = (e: File) => {
    postStore.addPostMedia(e)
}

const postContent = ref<typeof PostEditFormItem>()

const save = () => {
    postStore.savePost()
        .then((a: Post) => {
            if (route.params['postId'] == 'new')
                router.push(post(a.id))
        })
}



const isNotFound = computed(() => (!Boolean(userStore.user) && <string>route.params.postId == 'new') || <string>route.params.postId !== 'new' && parseInt(<string>route.params.postId) !== postStore.post.id);


const deleteArt = () => {
    postStore.deletePost().then(() => router.push(posts()))
}

</script>
