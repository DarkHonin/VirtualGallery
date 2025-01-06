<template>
    <div class="bg-background2 px-2 md:p-0 post-banner">
        <div class="flex justify-between items-center p-2">
            <span class="text-xs opacity-50  text-nowrap w-min block select-none">Project</span>
            <span v-if="post?.updated_at" class="text-xs opacity-50 ml-auto text-nowrap w-min block">{{
                formatISODate(post.updated_at!)
            }}</span>

        </div>
        <div class="flex items-center gap-2  px-2 select-none">
            <div class="flex gap-2 items-center w-full select-none">
                <template v-if="isAuthor && isRoute(postView())">
                    <BaseButton :disabled="!titleValid || postEditStore.isActing" @click="handleSave"
                        :loading="postEditStore.isActionActive(['creatingPost', 'savingPost'])">
                        <BaseIcon :name="editState ? 'save' : 'edit'" />
                    </BaseButton>
                </template>

                <BaseInput :disable="postEditStore.isActing" v-if="editState" class="flex-1 my-1.5" v-model="postTitle"
                    placeholder="Project title..." />
                <h2 v-else class="text-ellipsis overflow-hidden flex-1 block whitespace-nowrap w-1/2">{{ post?.title }}
                </h2>
            </div>


        </div>
        <div v-if="!isNewPost && !editState && !postEditStore.activeEntry && isAuthor && isRoute(postView())"
            class=" gap-2 bg-background2 p-2 my-2 flex">
            <BaseButton @click="postEditStore.createPostEntry" :disabled="postEditStore.isActing"
                v-if="!postEditStore.activeEntry" :loading="postEditStore.isActionActive('creatingEntry')">
                <BaseIcon name="add" />
            </BaseButton>

            <BaseButton @click="handleDownload" :disabled="postEditStore.isActing" :loading="downloading"
                v-if="!postEditStore.activeEntry">
                <BaseIcon name="download" />
            </BaseButton>

            <BaseButton :disabled="postEditStore.isActing" class="ml-auto" color="negative" @click="handleDelete"
                :loading="postEditStore.isActionActive('deletePost')">
                <BaseIcon name="delete" />
            </BaseButton>
        </div>
    </div>

</template>

<script lang="ts" setup>
import BaseButton from '@/components/button/Base.button.vue';
import ConfirmationDialog from '@/components/dialog/Confirmation.dialog.vue';
import BaseIcon from '@/components/icon/Base.icon.vue';
import BaseInput from '@/components/input/Base.input.vue';
import { usePost, type Post } from '@/db/post.model';
import { isRoute, posts, postView } from '@/router/routes';
import { api } from '@/services/index.service';
import { usePostEditStore } from '@/stores/PostEditor.store';
import { usePostsStore } from '@/stores/Posts.store';
import { formatISODate } from '@/utils/Date';
import { openDialog } from '@/utils/Dialog.compose';

import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';


const props = defineProps<{
    post: Post
}>()

const isPostEditPage = computed(() => (isAuthor && isRoute(postView())))

const isNewPost = computed(() => !(props.post?.id))

const { isAuthor } = usePost(props.post)

const postEditStore = usePostEditStore()
const router = useRouter()

const mutation = ref<string>()
const postTitle = computed({
    get() {
        return mutation.value ?? props.post?.title
    },
    set(nv: string) {
        mutation.value = nv
    }
})

const editState = ref(isNewPost.value)

const titleValid = computed(() => Boolean(postTitle.value && postTitle.value.length))
const postStore = usePostsStore()

const handleSave = async () => {
    if (isNewPost.value) {
        const NewPost: Post = await postEditStore.createPost(postTitle.value!)
        editState.value = false
        return router.push(postView(NewPost.id))
    }
    if (!editState.value) return editState.value = true
    await postEditStore.savePost({ ...props.post, title: postTitle.value })
    await postStore.syncPostFields(props.post.id!, 'title')
    editState.value = false
}



const handleDelete = async () => {
    const dialog = openDialog(
        ConfirmationDialog,
        {
            message: `Are you sure you want to delete the post '${props.post.title}' ?`,
            confirmColor: 'negative',
            confirmText: "Delete",
            rejectColor: 'primary',
        }
    )

    const doDelete = await new Promise((yay, nay) => {
        dialog.onClose(nay)
        dialog.onSubmit(yay)
    })

    if (!doDelete) return
    await postEditStore.deletePost(props.post.id!)
    router.push(posts())
}

const downloading = ref(false)

const handleDownload = async () => {
    downloading.value = true
    try {
        const file = await api("download", { postId: props.post!.id! })


        const link = Object.assign(document.createElement('a'), {
            download: `${props.post.title}.zip`,
            href: URL.createObjectURL(file),
        })
        link.click()

    } catch (e) {
        console.error(e)
    } finally {
        downloading.value = false
    }
}

</script>