import { Client } from "./db.ts";

export const getUserSession = async (client: Client) => {
    const {data, error} = await client.auth.getSession()
    if(error) throw error
    return data
}
