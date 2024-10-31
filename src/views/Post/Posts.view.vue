<template>
    <WaterfallLayout
        style="height: calc(100vh - 100px); max-height: calc(100vh - 100px); min-height: calc(-100px + 100vh);">
        <SpinnerLoader :loading="blogStore.isActionActive('loading')" :message="blogStore.activeActions.join('<br>')"
            size="lg" class="m-auto">
            <RouterView>
                <template #default="params">

                    <div class="p-2 gap-2 flex flex-col w-full" v-if="!params.Component">
                        <RouterLink :to="postEdit('new')" v-if="userStore.user"
                            class="w-full h-28 border border-dashed flex hover:h-24 hover:my-2 transition-all">
                            <BaseIcon name="add" size="xl" class="m-auto" />
                        </RouterLink>
                        <RouterLink :to="post(i.id)" v-for="i in blogStore.posts" :key="i.id">
                            <PostListItem :item="i" />
                        </RouterLink>
                    </div>


                    <component v-else :is="params.Component" />
                </template>

            </RouterView>

        </SpinnerLoader>
    </WaterfallLayout>
</template>

<script lang="ts" setup>


import SpinnerLoader from "@/components/loader/Spinner.loader.vue"

import WaterfallLayout from "@/components/layout/Waterfall.layout.vue"
import { useUserStore } from "@/stores/User.store"
import { useBlogStore } from "@/stores/Blog.store"
import PostListItem from "@/components/post/Post.listItem.vue";
import { onBeforeMount } from "vue";
import { RouterLink, RouterView } from "vue-router";
import { post, postEdit } from "@/router/routes";
import BaseIcon from "@/components/icon/Base.icon.vue";

const blogStore = useBlogStore()

onBeforeMount(() => {
    blogStore.loadPosts()
})

const userStore = useUserStore()

</script>