import { supabase } from "@/db/index.db";
import { NotFound } from "@/router/routes";
import { useUserStore } from "@/stores/User.store";
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

export const useAuthLifecycle = () => {
    const userStore = useUserStore();
    const route = useRoute();
    const router = useRouter();

    onMounted(() => {
        supabase.auth.onAuthStateChange((event, data) => {
            console.log(event);
            try {
                userStore.captureSession();
            } catch (e) {
                console.error(e);
            } finally {
                if (event == "SIGNED_OUT") {
                    if (route.meta.requiresAuth) {
                        router.push(NotFound());
                    }
                }
            }

            // console.log(event, data);
        });
    });
};
