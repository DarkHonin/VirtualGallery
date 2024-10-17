<template>
    <RouterView #default="{ Component, route }">
        <template v-if="!Component">
            <div class="flex">
                <div class="border rounded-sm border-primary p-2 m-2">
                    <div class="grid grid-cols-2">
                        <span>Email</span><span>{{ userStore.user?.email }}</span>
                    </div>
                    <div class="grid grid-cols-2">
                        <span>Created</span><span>{{ userStore.user?.created_at }}</span>
                    </div>
                </div>

                <div class="border rounded-sm border-primary p-2 m-2">
                    <div class="grid grid-cols-2 gap-2 items-center" v-for="created, service in services"
                        :key="service">
                        <span>{{ service }}</span>
                        <span v-if="created">{{ created }}</span>
                        <BaseButton v-else>
                            <BaseIcon name="link" @click="handleTumblrLink" />
                        </BaseButton>
                    </div>
                </div>
            </div>
        </template>
        <template v-else>
            <component :is="Component" :route="route" />

        </template>
    </RouterView>
</template>

<script setup lang="ts">
import type { Database } from '@/db/database.types';
import { useUserStore } from '../../stores/User.store'
import { computed } from 'vue';
import BaseButton from '@/components/button/Base.button.vue';
import BaseIcon from '@/components/icon/Base.icon.vue';
import { RouterView } from 'vue-router';

const userStore = useUserStore()

const services = computed<{ [s: string]: string | undefined }>(() => {
    const availableServies: Database["public"]["Enums"]["oauthprovider"][] = ["tumblr"]
    return Object.fromEntries(availableServies.map(s => {
        const service = userStore._profile?.oauth_tokens.find(({ service }) => s == service)
        if (!service) return [s, undefined]
        return [s, service.created_at]
    }))

})

const handleTumblrLink = () => {
    const client_id = import.meta.env.VITE_TUMBLR_KEY
    const url = `https://www.tumblr.com/oauth2/authorize?${new URLSearchParams({
        client_id,
        response_type: 'code',
        scope: 'write offline_access',
        state: "tumblr",
        ...(import.meta.env.VITE_ENV == 'LOCAL' ? { redirect_uri: "http://localhost:5173/profile/tumblr" } : {})
    }).toString()}`

    var win = window.open(url, '_blank');
    if (win)
        win.focus();
}



</script>