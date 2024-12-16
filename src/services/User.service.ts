import { supabase } from "@/db/index.db";
import { useDebugLogger } from "@/utils/Debug.logger";
import { DEBUG_AUTH } from "@/utils/env.flags";
import { NO_USER_SESSION } from "@/utils/Errors.list";
import { DEBUG_AUTH_FLAG } from "@/utils/Flags.list";
import { debugTimeout } from "@/utils/Timeout.debug";
const log = useDebugLogger(DEBUG_AUTH_FLAG);

export const registerWithEmail = async (
    ...args: Parameters<typeof supabase.auth.signUp>
) => {
    log("Register \\w Username & Password");

    await debugTimeout(DEBUG_AUTH_FLAG, 5000);

    const { error, data } = await supabase.auth.signUp(...args);

    if (error) {
        log("Failed to register user", error);
        if (DEBUG_AUTH) {
            console.error(error);
        }
        throw error;
    }
    return;
};

export const getUserSession = async () => {
    log("Fetching user session");
    await debugTimeout(DEBUG_AUTH_FLAG, 5000);


    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    if (!data.session) {
        log("No user session");
        if (DEBUG_AUTH) {
            console.trace();
        }
        throw NO_USER_SESSION;
    }
    return data.session;
};

export const signUserIn = async (
    ...args: Parameters<typeof supabase.auth.signInWithPassword>
) => {
    log("User signing \\w password");
    await debugTimeout(DEBUG_AUTH_FLAG, 5000);

    const { data, error } = await supabase.auth.signInWithPassword(...args);
    if (error) {
        log("Failed to sign in");
        if (DEBUG_AUTH) {
            console.trace();
        }
        throw error;
    }
};

export const signUserOut = async () => {
    log("User signing out");
    await debugTimeout(DEBUG_AUTH_FLAG, 5000);

    const { error } = await supabase.auth.signOut();
    if (error) {
        log("Failed to sign user out", error);
        if (DEBUG_AUTH) {
            console.error(error);
        }
        throw error;
    }
    return;
};
