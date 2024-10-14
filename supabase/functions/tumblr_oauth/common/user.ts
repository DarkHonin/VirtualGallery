import { Database } from "../../database_types.ts";
import { Client } from "./common.ts";
import {
    getUserFacingOAuthTokenServices,
    UserFacingOAuthToken,
} from "./tokens.ts";

export type Profile = Database["public"]["Tables"]["Profiles"]["Row"] | {
    oauth_tokens: Partial<UserFacingOAuthToken>[];
};

export const getUser = async (client: Client) => {
    const { data, error } = await client.auth.getUser();
    if (error) throw error;
    return data.user;
};
