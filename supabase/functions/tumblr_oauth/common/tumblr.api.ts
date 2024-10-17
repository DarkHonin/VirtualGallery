import { Client } from "./common.ts";
import { OAuthTokenTable } from "./tokens.ts";
import { getUser } from "./user.ts";

export const link_to_tumblr = async (client: Client, code: string) => {
    const user = await getUser(client);
    const formData = new FormData();
    Object.entries({
        grant_type: "authorization_code",
        code,
        client_id: Deno.env.get("TUMBLR_KEY") ?? "",
        client_secret: Deno.env.get("TUMBLR_SECRET") ?? "",
        redirect_uri: "http://localhost:5173/profile/tumblr",
    }).forEach(([k, v]) => formData.append(k, v));

    const resp = await fetch(
        "https://api.tumblr.com/v2/oauth2/token",
        {
            method: "POST",
            body: formData,
        },
    );

    const json = await resp.json();
    console.log(json);
    const { access_token, expires_in, refresh_token } = json;

    const { data, error } = await OAuthTokenTable(client).insert({
        access: access_token,
        service: "tumblr",
        refresh: refresh_token,
        user: user.id,
        expires_in,
    }).select().single();
};
