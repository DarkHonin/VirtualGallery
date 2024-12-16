import { Database } from "./database_types";
import { Client } from "./db";

export type OAuthToken = Database["public"]["Tables"]["OAuthTokens"]["Row"];
export type UserFacingOAuthToken = Pick<
    OAuthToken,
    "created_at" | "service" | "id"
>;

export const OAuthTokenTable = (client: Client) => client.from("OAuthTokens");

export const getOAuthTokens = async (client: Client, tokenIds: number[]) => {
    const { data, error } = await OAuthTokenTable(client).select("*").overlaps(
        "id",
        tokenIds,
    );
    if (error) throw error;
    return data as OAuthToken[];
};

export const getUserFacingOAuthTokenServices = async (
    client: Client,
    userId: string,
) => {
    const { data, error } = await OAuthTokenTable(client).select(
        "service,created_at,id",
    )
        .eq(
            "user",
            userId,
        );
    if (error) throw error;
    return data as Partial<UserFacingOAuthToken>[];
};
