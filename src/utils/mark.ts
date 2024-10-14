import { marked } from "marked";
import { imageParser } from "./markdown_parsers";
import { useActivePost } from "@/db/post.model";

export const parseMarkdown = (
    markdown: string,
) => {
    const { media } = useActivePost();
    marked.use({
        extensions: [
            // @ts-ignore
            imageParser(media.value),
        ],
    });

    return marked.parse(markdown);
};
