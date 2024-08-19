<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { supabase } from './db/index.db'
import { useUserStore } from './stores/User.store'
import SpinnerLoader from './components/loader/Spinner.loader.vue'
import DrawerComponent from './components/drawer/Drawer.component.vue'
import LayoutBase from './components/layout/Layout.base.vue';
import LayoutSplit from './components/layout/Layout.split.vue';
import DrawerElement from './components/drawer/Drawer.element.vue';
import BaseIcon from './components/icon/Base.icon.vue';
import BrandGraphic from './components/graphics/Brand.graphic.vue';
import type { MobileOtpType, EmailOtpType } from '@supabase/supabase-js';
import { artworks, slots, profile } from './router/routes';

const userStore = useUserStore()
const router = useRouter()

supabase.auth.onAuthStateChange((_, _session) => {
  const store = useUserStore()
  store._session = _session ?? undefined
})

onMounted(() => {

  const hash = window.location.hash.replace('#/?', '')

  const { type, token_hash } = Object.fromEntries(hash.split('&').map(e => e.split('=')))

  if (!token_hash || !type) return
  console.log("Logging in...")
  supabase.auth.verifyOtp({
    token_hash: token_hash.toString(),
    type: 'magiclink'
  }).then(() => router.replace({ name: "home" }))
})

const route = useRoute()

const routeRoot = computed(() => (route.matched.find(e => e.meta.title)) ?? undefined)

</script>

<template>
  <LayoutBase :stick="['top', 'left']" class="h-svh min-w-fit">
    <template #left v-if="!userStore.isActionActive('loading') && userStore.user">
      <DrawerComponent direction="vertical" expand>
        <DrawerElement icon="image" :to="artworks()" label="Artworks" />
        <DrawerElement icon="add_diamond" :to="slots()" label="Slots" />


        <DrawerElement v-if="userStore.user" icon="person" class="mt-auto" :label="userStore.user.email"
          :to="profile()">
          <template #actions>
            <BaseIcon @click="userStore.logout()" name="logout"
              class="block grow m-auto hover:bg-primary-hover py-2 px-1" />
          </template>
        </DrawerElement>
      </DrawerComponent>
    </template>
    <template #top>
      <DrawerComponent class="justify-center items-center">
        <DrawerElement :highlightActive="false" class="w-min" :to="{ name: 'home' }">
          <template #icon>
            <BrandGraphic width="25" height="25" />
          </template>
        </DrawerElement>

        <DrawerElement :highlightActive="false" class="w-min" v-if="routeRoot" :to="routeRoot!"
          :label="(routeRoot.meta.title as string)" />
        <!-- <label class=" col-span-full bg-primary font-bold text-lg" v-if="pageTitle">{{ pageTitle }}</label> -->

      </DrawerComponent>
    </template>
    <template #default>
      <RouterView v-slot="{ Component }">
        <component v-if="!userStore.isActing" :is="Component" />
        <template v-else>
          <div class="w-full flex h-full">
            <SpinnerLoader class="m-auto" :loading="true" :message="userStore.activeActions.join('<br/>')" />
          </div>
        </template>
      </RouterView>
    </template>
    <template #bottom>

    </template>
  </LayoutBase>

</template>
