<template>
    <SpinnerLoader class="m-auto" :loading="true" :message='error ?? `Linking to ${queryObject.state}`'>

    </SpinnerLoader>
</template>

<script lang="ts" setup>
import SpinnerLoader from '@/components/loader/Spinner.loader.vue';
import { profile } from '@/router/routes';
import { api } from '@/services/index.service';
import type { ProfileLinks } from '@/utils/ProfileLinks';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';


const props = defineProps<{
    service: ProfileLinks
}>()

const route = useRoute()
const router = useRouter()

const queryObject = computed(() => {
    const opts = ["code", "state"]
    return Object.fromEntries(opts.map((k) => [k, route.query[k]]))
})

const error = ref<string>()


onMounted(() => {
    // api("tumblr_oauth", { code: queryObject.value.code }).then((success) => {
    //     if (!success)
    //         error.value = "Failed to link to tumblr"
    //     router.replace(profile())
    // })
})

</script>