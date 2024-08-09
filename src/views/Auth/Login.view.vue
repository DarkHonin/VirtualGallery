<script setup lang="ts">
import BaseInput from '@/components/input/Base.input.vue'
import BaseButton from '@/components/button/Base.button.vue'
import { ref } from 'vue';

import { useUserStore } from '@/stores/User.store'
import LayoutSplit from '@/components/layout/Layout.split.vue';
import SpinnerLoader from '@/components/loader/Spinner.loader.vue';
import { useRoute, useRouter } from 'vue-router';

const userEmail = ref<string>()
const userPassword = ref<string>()
const loading = ref(false)
const userStore = useUserStore()

const isLocal = import.meta.env['VITE_ENV'] == "LOCAL"
const router = useRouter()

const handleLogin = async () => {
    if (!userEmail.value) return
    try {
        loading.value = true
        await new Promise((y) => setTimeout(y, 5000))
        if (isLocal)
            await userStore.signInWPass(userEmail.value, userPassword.value!)
        else
            await userStore.signIn(userEmail.value)
        router.replace({ name: "profile" })
    } catch (error) {
        if (error instanceof Error) {
            alert(error.message)
        } else if (typeof (error) == "string") {
            alert(error)
        } else {
            alert("Something went wrong...")
        }
    } finally {
        loading.value = false
    }
}

</script>

<template>
    <LayoutSplit :cells="3">
        <form class="vert justify-center items-center col-start-2" @submit.prevent="handleLogin">
            <BaseInput label="Email Address" v-model="userEmail" placeholder="example@mail.com" type="email" required />
            <BaseInput label="Password" v-model="userPassword" placeholder="*********" type="password" v-if="isLocal"
                required />
            <BaseButton type="submit" :label="isLocal ? 'Login' : 'Send Magic Link'" :disabled="!userEmail"
                :loading="loading" />
            <SpinnerLoader class="m-auto" :loading="loading" message="Logging in..." />
        </form>
    </LayoutSplit>

</template>

<style></style>