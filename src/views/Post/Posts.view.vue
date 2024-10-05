<template>
    <WaterfallLayout>
        <PageBanner />
        <RouterView>
            <template v-slot="{ Component }">
                <div class="w-auto flex h-full">
                    <SpinnerLoader :loading="store.isActionActive('loading')"
                        :message="store.activeActions.join('<br>')" size="lg" class="m-auto">
                        <BaseGrid :items="store.posts" v-if="!Component" class="p-2">
                            <template #prepend="{ itemClassString }" v-if="userStore.user">
                                <RouterLink :to="post('new')" :class="itemClassString">
                                    <PostListItem />
                                </RouterLink>
                            </template>

                            <template #item="{ item, itemClassString }">
                                <RouterLink :key="item.id" :to="post(item.id)" :class="itemClassString">
                                    <PostListItem :item="item" />
                                </RouterLink>

                            </template>
                        </BaseGrid>
                        <template v-else>

                            <component :is="userStore.user ? Component : PostView" />
                        </template>
                    </SpinnerLoader>
                </div>
            </template>
        </RouterView>
    </WaterfallLayout>
</template>

<script lang="ts" setup>

import { usePostStore } from "@/stores/Post.store"

import SpinnerLoader from "@/components/loader/Spinner.loader.vue"
import BaseGrid from "@/components/grid/Base.grid.vue"
import { post } from "@/router/routes"

import WaterfallLayout from "@/components/layout/Waterfall.layout.vue"
import PageBanner from "@/components/core/PageBanner.vue"
import PostListItem from "@/components/post/Post.listItem.vue"
import { useUserStore } from "@/stores/User.store"
import PostView from "./Post.view.vue"

const store = usePostStore()
const userStore = useUserStore()


</script>