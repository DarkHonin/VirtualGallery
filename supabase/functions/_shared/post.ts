import type { Database } from "./database_types.ts";
import type { Client } from "./db.ts";

const { fromEntries: __, entries: _ } = Object;

export type Post = Database["public"]["Tables"]["Posts"]["Row"];

export const PostTable = (client: Client) : ReturnType<Client['from']> => client.from("Posts");

export interface ResponseManifest {
    item_count: number;
    last_updated: string;
}

export const parseFilter = async (req: Request) => {
    const body = await req.json();

    const parsers = {
        postId: (v: string | undefined) => v ? parseInt(v) : undefined,
        lastPublish: (v: string | undefined) => v,
    };

    const result = __(
        _(parsers).map(([key, parser]) => [key, parser(body[key])]),
    );

    type resultType = {
        [i in keyof typeof parsers]: any;
    };

    return result as resultType;
};
