const imageParserRegex =
    /!(\|(?<floatTo>[<|>]{1}))?\[(?<alt_text>.+?)\]\((?<src>.+?)(\|(?<width>\d+))?\)/;

export const imageParser = (media: { [mediaName: string]: string }) => ({
    name: "image",
    level: "inline" as "inline", // Is this a block-level or inline-level tokenizer?
    start(src: string) {
        return src.match(imageParserRegex)
            ?.index;
    }, // Hint to Marked.js to stop and check for a match
    tokenizer(src: string) {
        const match = new RegExp(imageParserRegex).exec(src);
        if (match) {
            const { alt_text, src, width, floatTo } = match.groups ?? {};
            // if (!width && !floatTo) return false;
            return {
                type: "image",
                raw: match[0],
                alt_text,
                src: media[src as string],
                width,
                floatTo,
            };
        }
        // return false to use original codespan tokenizer
        return false;
    },
    renderer(
        { alt_text, src, width, floatTo }: {
            alt_text: string;
            src: string;
            width: string;
            floatTo: "<" | ">" | "|";
        },
    ) {
        const floats = {
            ">": "float: right;",
            "<": "float: left;",
            "|": "clear: both;",
        };
        const float = !floatTo ? "" : `style="${floats[floatTo]}"`;
        return `<img src="${src}" alt="${alt_text}" ${
            width ? `width='${width}'` : ""
        } ${float} />`;
    },
});
