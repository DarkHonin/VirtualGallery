<script setup lang="ts">
import { computed, onErrorCaptured, onMounted, ref } from 'vue';
import { RouterView, useRoute, useRouter } from 'vue-router'
import { supabase } from './db/index.db'
import { useUserStore } from './stores/User.store'
import PageBanner from './components/core/PageBanner.vue';
import { useAuthLifecycle } from './utils/Auth.lifecycle';
import SpinnerLoader from './components/loader/Spinner.loader.vue';
import { useDialogBinding } from './utils/Dialog.compose';

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

const error = ref()

onErrorCaptured((err) => {
  error.value = err

})

useAuthLifecycle()

const { dialogSession } = useDialogBinding()

</script>

<template>
  <div class="error" v-if="error">{{ JSON.stringify(error) }}</div>
  <template v-else>
    <PageBanner />

    <RouterView />
    <component v-if="dialogSession" :is="dialogSession.component" v-bind="dialogSession.props" />


  </template>
</template>
