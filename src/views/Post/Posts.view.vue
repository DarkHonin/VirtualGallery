<template>
    <WaterfallLayout
        style="height: calc(100vh - 100px); max-height: calc(100vh - 100px); min-height: calc(-100px + 100vh);">
        <SpinnerLoader :loading="blogStore.isActionActive('loading')" :message="blogStore.activeActions.join('<br>')"
            size="lg" class="m-auto">
            <RouterView>
                <template #default="params">

                    <div class="p-2 gap-2 flex flex-col w-full" v-if="!params.Component">
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
import { post } from "@/router/routes";

const blogStore = useBlogStore()

onBeforeMount(() => {
    blogStore.loadPosts()
})

</script>