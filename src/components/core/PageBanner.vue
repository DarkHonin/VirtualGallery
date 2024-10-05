<template>
    <div class="page-banner">
        <h1 class="banner-container">
            <BrandGraphic height="60" width="60" v-if="false" />
            <RouterLink class="banner-title" :to="home()">
                HoninWorx
            </RouterLink>
        </h1>
        <div class="nav-bar">


            <NavLink :to="posts()">
                Posts
            </NavLink>

            <NavLink :to="home()">
                About
            </NavLink>

            <template v-if="isLocal || authStore.user">

                <NavLink :to="auth($route.path)" v-if="!authStore.user">
                    Login
                </NavLink>
                <NavLink v-else @click="authStore.logout()" class="relative">
                    <BaseLoader :loading="authStore.isActing" />

                    Logout
                </NavLink>

            </template>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { RouterLink } from 'vue-router';
import BrandGraphic from '../graphics/Brand.graphic.vue';
import { home, auth, posts } from '@/router/routes';
import NavLink from './NavLink.vue';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useUserStore } from '@/stores/User.store';
import SpinnerLoader from '../loader/Spinner.loader.vue';
import BaseLoader from '../loader/Base.loader.vue';

const authStore = useUserStore()

const isLocal = computed(() => import.meta.env['VITE_ENV'] == 'LOCAL')
</script>

<style lang="scss">
.page-banner {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: sticky;
    top: 0px;
    background-color: var(--background);
    z-index: 99;

    .banner-container {
        width: min-content;
        max-width: 800px;
        height: min-content;

        .banner-title {
            width: min-content;
        }
    }


    .nav-bar {
        background-color: var(--background-2);
        width: 100vw;
        left: 0px;
        display: flex;
        justify-content: center;
        gap: 0.5em;
    }
}
</style>