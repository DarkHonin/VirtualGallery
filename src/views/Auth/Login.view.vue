<script setup lang="ts">
import BaseInput from '@/components/input/Base.input.vue'
import BaseButton from '@/components/button/Base.button.vue'
import { computed, ref, unref } from 'vue';

import { useUserStore } from '@/stores/User.store'
import SpinnerLoader from '@/components/loader/Spinner.loader.vue';
import { useRoute, useRouter } from 'vue-router';
import Content from '@/components/core/Content.vue';
import Captcha from '@/components/util/Captcha.vue';
import { home } from '@/router/routes';

const userEmail = ref<string>()
const userPassword = ref<string>()

const userStore = useUserStore()


const router = useRouter()
const route = useRoute()

const redirectTo = computed(() => {
    console.log(route.query)
    if (!route.query['returnTo']) return home()
    return (route.query['returnTo']) as string
})

const token = ref()

const handleLogin = async () => {
    if (!userEmail.value) return
    try {

        await userStore.signInWithPassword({
            email: userEmail.value,
            password: userPassword.value!,
            options: {
                captchaToken: token.value
            }
        })

        router.replace(redirectTo.value)
    } catch (error) {
        if (error instanceof Error) {
            alert(error.message)
        } else if (typeof (error) == "string") {
            alert(error)
        } else {
            alert("Something went wrong...")
        }
    }
}

const formValid = computed(() => ![userEmail, userPassword, token].map(unref).some(e => !e))

</script>

<template>
    <Content>

        <form class="vert justify-center items-stretch flex flex-col col-start-2" @submit.prevent="handleLogin">
            <BaseInput label="Email Address" v-model="userEmail" placeholder="example@mail.com" type="email" required />
            <BaseInput label="Password" v-model="userPassword" placeholder="*********" type="password" required />
            <Captcha v-model:token="token" />
            <SpinnerLoader class="m-auto" :loading="userStore.isActing" :message="userStore.activeActions.join(' ')">
                <BaseButton type="submit" :label="'Login'" :disabled="!formValid" />
            </SpinnerLoader>
        </form>

    </Content>

</template>

<style></style>