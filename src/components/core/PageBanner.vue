<template>
    <div class="page-banner border-b-background border-b-2 sticky top-0">
        <h1 class="banner-container flex justify-center items-center gap-2">
            <BrandGraphic height="60" width="60" />
            <RouterLink class="banner-title" :to="home()">
                HoninWorx
            </RouterLink>
        </h1>
        <div class="nav-bar hidden sm:flex justify-center">
            <NavLink :to="posts()">
                Projects
            </NavLink>

            <NavLink :to="about()">
                About
            </NavLink>

            <template v-if="userStore.isSignedIn">
                <template v-if="!userStore.user">
                    <NavLink v-if="ENABLE_LOGIN" :to="login()">
                        Login
                    </NavLink>
                    <NavLink v-if="ENABLE_REGISTER" :to="registerPage()">
                        Register
                    </NavLink>
                </template>

                <NavLink v-else @click="handleLogout" class="relative">
                    <BaseLoader :loading="userStore.isActionActive('signOut')" size="xs">
                        Logout
                    </BaseLoader>
                </NavLink>

            </template>
        </div>
        <div class="flex flex-col nav-bar sm:hidden items-center expander relative cursor-pointer gap-2">
            <label class="absolute flex items-center h-7 top-0 cursor-pointer select-none w-full">
                <BaseIcon :name="expanderOpen ? 'close' : 'menu'" size="lg" />
                <input @click="expanderOpen = !expanderOpen" :checked="expanderOpen" type="checkbox" hidden
                    ref="expanderInput">
            </label>
            <NavLink class="w-full justify-center items-center text-center" :to="home()" v-if="isRoute(home())">
                Home
            </NavLink>
            <NavLink class="w-full justify-center items-center text-center" :to="posts()">
                Projects
            </NavLink>

            <NavLink class="w-full justify-center items-center text-center" :to="about()">
                About
            </NavLink>
            <template v-if="!userStore.isSignedIn">
                <NavLink v-if="ENABLE_LOGIN" class="w-full justify-center items-center text-center" :to="login()">
                    Login
                </NavLink>

                <NavLink v-if="ENABLE_REGISTER" class="w-full justify-center items-center text-center"
                    :to="registerPage()">
                    Register
                </NavLink>
            </template>
            <template v-else>
                <NavLink @click="handleLogout" class="w-full justify-center items-center text-center">
                    <BaseLoader class="justify-center" :loading="userStore.isActing">
                        Logout
                    </BaseLoader>
                </NavLink>
            </template>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onBeforeRouteLeave, onBeforeRouteUpdate, RouterLink, useRoute, useRouter } from 'vue-router';
import BrandGraphic from '../graphics/Brand.graphic.vue';
import { home, auth, posts, about, login, registerPage, isRoute } from '@/router/routes';
import NavLink from './NavLink.vue';
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useUserStore } from '@/stores/User.store';
import SpinnerLoader from '../loader/Spinner.loader.vue';
import BaseLoader from '../loader/Base.loader.vue';
import BaseIcon from '../icon/Base.icon.vue';
import { register } from 'module';
import { ENABLE_LOGIN, ENABLE_REGISTER } from '@/utils/env.flags';

const userStore = useUserStore()

const isLocal = computed(() => import.meta.env['VITE_ENV'] == 'LOCAL')

const route = useRoute()

const expanderOpen = ref(false)

watch(route, () => {
    expanderOpen.value = false
})

const router = useRouter()

const handleLogout = () => {
    userStore.logout().then(() => {
        router.replace(home())
    })
}


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
        background-color: var(--background-3);
        width: 100vw;
        left: 0px;
        transition: max-height .2s;

        &.expander {
            max-height: 28px;
            overflow: hidden;

            &:has(input:checked) {
                max-height: 200px;
                overflow-y: auto;
            }

            .nav-link {
                order: 1;
            }

            .nav-link.router-link-exact-active {
                order: 0;
            }
        }
    }
}
</style>