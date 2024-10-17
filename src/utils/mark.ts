import { marked } from "marked";
import { imageParser } from "./markdown_parsers";
import { useActivePost } from "@/db/post.model";

export const parseMarkdown = (
    markdown: string,
) => {
    marked.use({
        extensions: [
            // @ts-ignore
            imageParser(),
        ],
    });

    return marked.parse(markdown);
};
