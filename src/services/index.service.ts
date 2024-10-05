type AvailableEndpoint = "vue-signin" | "markgown_gen";

export const api = async (
    endpoint: AvailableEndpoint,
    opts?: Parameters<typeof fetch>[1],
) => {
    const result = await fetch(
        [import.meta.env["VITE_SUPABASE_URL"], "functions/v1", endpoint].join(
            "/",
        ),
        {
            ...opts,
            method: opts?.body ? "POST" : "GET",
            headers: {
                ...opts?.headers,
                Authorization: import.meta.env["VITE_SUPABASE_ANNON_KEY"],
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers":
                    "authorization, x-client-info, apikey, content-type, Access-Control-Allow-Origin, Access-Control-Allow-Headers",
            },
        },
    );
    const body = await result.json();
    if (result.status !== 200) {
        throw body;
    }
    return body;
};
