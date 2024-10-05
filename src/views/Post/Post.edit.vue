<template>
    <div v-if="isNotFound" class="px-2 w-full flex flex-col justify-center items-center h-full">
        <BaseIcon name="error" class="text-button-negative" />
        <h2>
            Could not find artwork
        </h2>
    </div>
    <div v-else class="p-2 flex flex-col place-content-start w-full" style="width: 660px;">
        <div class="flex gap-2 h-min w-full max-h-min ">
            <BaseButton color="positive" label="Save" :disabled="!activePost.title" :loading="postStore.isActing"
                @click="save()" />
            <BaseButton v-if="activePost.id" color="negative" label="Delete" :disabled="!activePost.id"
                :loading="postStore.isActing" @click="deleteArt()" />
            <label v-show="postStore.isActing" class="ml-auto items-center flex gap-2">
                <p>{{ postStore.activeActions.join(' - ') }}
                </p>
                <SpinnerLoader :loading="true" />
            </label>
        </div>

        <div class="gap-2 flex-row flex w-full">
            <PostEditFormItem ref="postContent" v-model:post="activePost" @update:post="updateEdit"
                :markup="postStore._markup" />

            <div class="flex flex-col gap-2">
                <h3>Media</h3>
                <ImageInput :model-value="undefined" :show-preview="false" @update:model-value="imageUpload" />

                <PostMediaListItem @insertImage='insertImage' @deleteImage='deleteImage' v-for="i in activePost.media"
                    :path="i" />
            </div>

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
import PostService from '@/services/PostEdit.service'
import BaseInput from '@/components/input/Base.input.vue'
import PostEditFormItem from '@/components/post/PostEdit.formItem.vue'
import PostMediaListItem from '@/components/post/PostMedia.listItem.vue'
import { useUserStore } from '@/stores/User.store'

const postStore = usePostStore()
const route = useRoute()

const router = useRouter()
const userStore = useUserStore()

const { activePost } = useActivePost()

const imageUpload = (e: File) => {
    postStore.addPostMedia(e)
}

const postContent = ref<typeof PostEditFormItem>()

const insertImage = (url: string) => {
    if (!postContent.value) return
    console.log(url)
    postContent.value.insertContent(`![alt text](${url})`)
}

const deleteImage = async (path: string, publicUrl: string) => {
    const status = await window.confirm("Deleting this media will remove it from the database")
    if (!status) return

    await postStore.deleteMedia(path)

    if (!postStore.post.content) return
    const match = `![alt text](${publicUrl})`
    while (postStore.post.content.indexOf(match) > -1)
        postStore.post.content = postStore.post.content.replace(match, '')
}

const save = () => {
    postStore.savePost()
        .then((a: Post) => {
            if (route.params['postId'] == 'new')
                router.push(post(a.id))
        })
}

const isNotFound = computed(() => (!Boolean(userStore.user) && <string>route.params.postId == 'new') || <string>route.params.postId !== 'new' && parseInt(<string>route.params.postId) !== postStore.post.id);


var timeout: NodeJS.Timeout | undefined = undefined

const updateEdit = () => {
    const doTimeout = () =>
        timeout = setTimeout(async () => {
            save()
            clearTimeout(timeout)
            timeout = undefined
        }, 2000)
    if (!timeout)
        return doTimeout()
    clearTimeout(timeout)
    doTimeout()
}

const deleteArt = () => {
    postStore.deletePost().then(() => router.push(posts()))
}

</script>
