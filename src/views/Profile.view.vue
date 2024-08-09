<template>
    <div>
        {{ userStore.user }}
    </div>
</template>

<script setup lang="ts">
import { useUserStore } from '../stores/User.store'

const userStore = useUserStore()


</script>