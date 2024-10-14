import { getProfile, getUser, profileTable } from "./common/user.ts";
import { Client } from "./common/common.ts";
import { uploadBucket } from "./common/buckets.ts";
import { PostgrestError } from "jsr:@supabase/supabase-js@2";

export const setup_user_profile = async (client: Client) => {
    try {
        const profile = await getProfile(client);
        return profile;
    } catch (e) {
        console.error(e);
        if ((e as PostgrestError).code == "PGRST116") {
            console.error("No user profile creating");
            const user = await getUser(client);
            console.error(`User email: `, user.email);
            const { error } = await profileTable(client).insert({
                user: user.id,
            }).select("*").single();
            if (error) throw error;
            return getProfile(client);
        } else {
            throw e;
        }
    }
};
