<template>
    <div v-if="isNotFound" class="px-2 w-full flex flex-col justify-center items-center h-full">
        <BaseIcon name="error" class="text-button-negative" />
        <h2>
            Could not find post
        </h2>
    </div>
    <div v-else class="p-2 flex flex-col place-content-start w-full" style="width: 800px;">
        <div class="flex gap-2 h-min w-full max-h-min ">
            <BaseButton color="positive" label="Save" :disabled="!activePost.title" :loading="postStore.isActing"
                @click="save()" />
            <BaseButton v-if="activePost.id" color="negative" label="Delete" :disabled="!activePost.id"
                :loading="postStore.isActing" @click="deleteArt()" />

            <label v-show="postStore.isActing" class="m-auto items-center flex gap-2">
                <p>{{ postStore.activeActions.join(' - ') }}
                </p>
                <SpinnerLoader :loading="true" />
            </label>
            <PublishButton class="ml-auto" :publish-string="activePost.publish ?? undefined"
                @update:publish-string="(nv: string | null) => { activePost.publish = nv; save() }" />
        </div>

        <div class="gap-2 flex-row flex w-full">
            <PostEditFormItem ref="postContent" v-model:post="activePost" :markup="postStore._markup" />

        </div>

    </div>

</template>

<script setup lang="ts">

import { computed, onMounted, ref } from 'vue'
import { useActivePost, type Post } from "@/db/post.model"
import { usePostStore } from "@/stores/Post.store"
import { useRoute, useRouter } from 'vue-router'
import ImageInput from '@/components/input/Image.input.vue'
import BaseButton from '@/components/button/Base.button.vue'
import { supabase } from '@/db/index.db'
import SpinnerLoader from '@/components/loader/Spinner.loader.vue'
import BaseIcon from '@/components/icon/Base.icon.vue'

import { post, posts } from '@/router/routes'
import PostSetupFormItem from '@/components/post/PostEdit.formItem.vue'
import TextareaInput from '@/components/input/Textarea.input.vue'
import PostService from '@/services/Post.service'
import BaseInput from '@/components/input/Base.input.vue'
import PostEditFormItem from '@/components/post/PostEdit.formItem.vue'
import PostMediaListItem from '@/components/post/PostMedia.listItem.vue'
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
