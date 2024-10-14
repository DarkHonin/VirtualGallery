<template>
    <SpinnerLoader :message='`Linking to ${service}`'>

    </SpinnerLoader>
</template>

<script lang="ts" setup>
import SpinnerLoader from '@/components/loader/Spinner.loader.vue';
import type { ProfileLinks } from '@/utils/ProfileLinks';


const props = defineProps<{
    service: ProfileLinks
}>()

</script>