import type { Session } from "@supabase/supabase-js";
import { defineStore } from "pinia";
import { supabase } from "@/db/index.db";
import { defineStateActions, type StoreState } from "./util/StateActions.util";
import { api } from "@/services/index.service";
import type { Profile } from "@/db/Profile.model";

export const userStoreActions = {
  loading: "Loading Session",
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
    ...userStoreStateActions.getters,
  },
  actions: {
    preflight() {
      return userStoreStateActions.runAction(this, "loading", async () => {
        this._profile = await api("user_profile");
        return supabase.auth.getSession().then(({ data }) => {
          if (!data || !data.session) return (this._session = undefined);
          this._session = data.session;
        });
      });
    },
    async signIn(email: string) {
      return userStoreStateActions.runAction(
        this,
        "signIn",
        async () => {
          await api("vue-signin", { body: JSON.stringify({ email }) });
          this._profile = await api("user_profile");
        },
      );
    },
    async signInWPass(email: string, password: string) {
      return userStoreStateActions.runAction(this, "signIn", async () => {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        this._session = data.session;
      });
    },
    logout() {
      return userStoreStateActions.runAction(this, "signOut", async () => {
        await new Promise((y) => setTimeout(y, 5000));
        this._session = undefined;
        return supabase.auth.signOut();
      });
    },
  },
});
