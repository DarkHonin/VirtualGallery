import { Database } from "../database_types.ts";
import { Client } from "./db.ts";
import {
    getUserFacingOAuthTokenServices,
    UserFacingOAuthToken,
} from "./tokens.ts";

export type Profile = Database["public"]["Tables"]["Profiles"]["Row"] & {
    oauth_tokens: Partial<UserFacingOAuthToken>[];
};

export const getUser = async (client: Client) => {
    const { data, error } = await client.auth.getUser();
    if (error) throw error;
    return data.user;
};

export const getProfile = async (client: Client) => {
    console.log("Getting profile");
    const user = await getUser(client);
    const { data, error } = await profileTable(client).select("*").eq(
        "user",
        user.id,
    ).single();
    if (error) throw error;
    console.log("Profile found");

    console.log("resolving auth tokens");
    (data as Profile).oauth_tokens = await getUserFacingOAuthTokenServices(
        client,
        user.id,
    );

    return data as Profile;
};

export const profileTable = (client: Client) => client.from("Profiles");
