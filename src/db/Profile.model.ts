import type { Database } from "./database.types";

export type OAuthToken = Pick<
    Database["public"]["Tables"]["OAuthTokens"]["Row"],
    "service" | "created_at"
>;

export type Profile =
    & Omit<
        Database["public"]["Tables"]["Profiles"]["Row"],
        "oauth_tokens"
    >
    & {
        oauth_tokens: OAuthToken[];
    };
