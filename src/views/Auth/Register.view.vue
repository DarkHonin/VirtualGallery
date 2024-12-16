<script setup lang="ts">
import BaseInput from '@/components/input/Base.input.vue'
import BaseButton from '@/components/button/Base.button.vue'
import { computed, ref, unref } from 'vue';

import { useUserStore } from '@/stores/User.store'
import SpinnerLoader from '@/components/loader/Spinner.loader.vue';
import { useRoute, useRouter } from 'vue-router';
import Content from '@/components/core/Content.vue';
import Captcha from '@/components/util/Captcha.vue';

const userEmail = ref<string>()
const userPassword = ref<string>()
const userPasswordRepeat = ref<string>()
const userStore = useUserStore()


const router = useRouter()
const route = useRoute()

const redirectTo = computed(() => {
    console.log(route.query)
    if (!route.query['returnTo']) return { name: "profile" }
    return (route.query['returnTo']) as string
})

const handleRegister = async () => {
    if (!userEmail.value) return
    try {
        await userStore.registerUser({
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

const token = ref()
const formValid = computed(() => {
    if ([userEmail, userPassword, userPasswordRepeat, token].map(unref).some(e => !e))
        return false
    if (![userPassword, userPasswordRepeat].map(unref).some(e => !e) && userPassword.value !== userPasswordRepeat.value)
        return "Passwords dont match"
    return true
}
)

</script>

<template>
    <Content>
        <form class="vert flex flex-col w-full  items-stretch col-start-2" @submit.prevent="handleRegister">
            <BaseInput label="Email Address" v-model="userEmail" placeholder="example@mail.com" type="email" required />
            <BaseInput label="Password" v-model="userPassword" placeholder="*********" type="password" required />
            <BaseInput label="Retype Password" v-model="userPasswordRepeat" placeholder="*********" type="password"
                required />
            <p class="text-negative text-center m-auto" v-if="(typeof formValid == 'string')">
                {{ formValid }}
            </p>
            <Captcha v-model:token="token" />
            <SpinnerLoader class="m-auto" :loading="userStore.isActing" :message="userStore.activeActions.join(' ')">
                <BaseButton type="submit" :label="'Register'"
                    :disabled="(typeof formValid == 'boolean' && !formValid)" />
            </SpinnerLoader>
        </form>
    </Content>
</template>

<style></style>