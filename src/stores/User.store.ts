import type { Session } from "@supabase/supabase-js";
import { defineStore } from "pinia";
import { supabase } from "@/db/index.db";
import { defineStateActions, type StoreState } from "./util/StateActions.util";
import { api } from "@/services/index.service";
import type { Profile } from "@/db/Profile.model";
import {
  getUserSession,
  registerWithEmail,
  signUserIn,
  signUserOut,
} from "@/services/User.service";
import { useRouter } from "vue-router";
import { home } from "@/router/routes";

export const userStoreActions = {
  loading: "Loading Session",
  signup: "Creating account",
  signIn: "Signing In",
  signOut: "Signing Out",
};

const userStoreStateActions = defineStateActions(userStoreActions);

interface UserStore extends StoreState<typeof userStoreActions> {
  _session?: Session;
  _profile?: Profile;
}

export const useUserStore = defineStore("UserStore", {
  state: (): UserStore => ({
    _session: undefined,
    _profile: undefined,
    ...userStoreStateActions.state,
  }),
  getters: {
    user: ({ _session }) => _session?.user,
    isSignedIn: ({ _session }) => Boolean(_session),
    ...userStoreStateActions.getters,
  },
  actions: {
    ///
    async captureSession() {
      return userStoreStateActions.runAction(this, "loading", async () => {
        this._session = await getUserSession();
      });
    },

    async registerUser(...args: Parameters<typeof registerWithEmail>) {
      return userStoreStateActions.runAction(this, "signup", async () => {
        return registerWithEmail(...args);
      });
    },

    async signInWithPassword(...args: Parameters<typeof signUserIn>) {
      return userStoreStateActions.runAction(this, "signIn", async () => {
        return await signUserIn(...args);
      });
    },

    ///

    logout() {
      return userStoreStateActions.runAction(this, "signOut", async () => {
        await signUserOut();
        return;
      });
    },
  },
});
