<template>
    <div class="flex">
        <VueHcaptcha class="mx-auto my-2" sitekey="aa746e26-bb48-430e-925a-fe6836da7ea6" @expired="handleCaptchaExpire"
            @error="handleCaptchaError" @verify="handleCaptchaVerify" />

    </div>
</template>


<script lang="ts" setup>
import VueHcaptcha from '@hcaptcha/vue3-hcaptcha';
import { ref, toRef } from 'vue';

const handleCaptchaError = (...args: any[]) => { console.error(args); handleCaptchaExpire() }


const props = defineProps<{
    token?: string
}>()

const emit = defineEmits<{
    (e: 'update:token', token?: string, ekey?: string): void
}>()

const handleCaptchaVerify = (token: string, ekey: string) => emit("update:token", token, ekey)
const handleCaptchaExpire = () => emit("update:token", undefined, undefined)

</script>