const transformers: {
    name: string;
    upRex: RegExp;
    downRex: RegExp;
    up(args: any, imageCache: { [mediaName: string]: string }): string;
    down(args: any): string;
    debug?: boolean;
}[] = [
    {
        name: "rule",
        upRex: new RegExp(/^[-]{3,}$/mg),
        downRex: new RegExp(/<hr>/),
        up: () => `<hr>`,
        down: () => `---`,
        // debug: true,
    },
    {
        name: "header",
        upRex: new RegExp(/^(?<hashes>#+) (?<content>.+)$/mg),
        downRex: new RegExp(/<h(?<hashes>\d+)>(?<content>.+?)<\/h\k<hashes>>/),
        up: ({ hashes, content }) =>
            `<h${hashes.length}>${content}</h${hashes.length}>`,
        down: ({ hashes, content }) =>
            `${"#".repeat(parseInt(hashes))} ${content}`,
        // debug: true,
    },
    {
        name: "newline",
        upRex: new RegExp(/\n(?<newlines>\n+)/mg),
        downRex: new RegExp(/<br>/mg),
        up: ({ newlines }) => `\n<br>`.repeat(newlines.length),
        down() {
            return `\n\n`;
        },
    },
    {
        name: "paragraph",
        upRex: new RegExp(/\n(?<content>.+?)\n/mg),
        downRex: new RegExp(/<p>(?<content>.*?)<\/p>/),
        up: ({ content }) => `<p>${content}</p>`,
        down: ({ content }) => `\n${content}\n`,
        // debug: true,
    },

    {
        name: "image",
        upRex: new RegExp(
            /!\[(?<alt_text>.+?)\]\((?<src>.+?)(\s*\|\s*(?<width>\d+))?\)/mg,
        ),
        downRex: new RegExp(/<hr>/),
        up: ({ alt_text, src, width }, imageCache) => {
            const resolvedSrc = imageCache[src] ? imageCache[src] : src;
            return `<img src="${resolvedSrc}" alt="${alt_text}" ${
                width ? `width="${width}"` : ""
            }>`;
        },
        down: ({ alt_text, src, width }) =>
            `![${alt_text}](${src}${width ? ` | ${width}` : ""})`,
        // debug: true,
    },
];

export const toMarkup = (
    markdown: string,
    imageCache: { [mediaName: string]: string },
) => {
    let subject = markdown;
    transformers.forEach(({ upRex, up, debug }) => {
        upRex.lastIndex = 0;
        if (debug) {
            console.log("up", upRex);
            console.log(subject);
        }
        let m = undefined;
        while ((m = upRex.exec(subject))) {
            if (m.index == upRex.lastIndex) {
                upRex.lastIndex++;
            }
            if (debug) {
                console.log("up", m, m[0], up(m.groups, imageCache));
            }
            while (subject.indexOf(m[0]) > -1) {
                subject = subject.replace(m[0], up(m.groups, imageCache));
            }
        }
    });

    return subject;
};

export const toMarkdown = (markup: string) => {
    let subject = markup;
    transformers.forEach(({ downRex, down, debug }) => {
        downRex.lastIndex = 0;
        let m = undefined;
        if (debug) {
            console.log("down", downRex);
        }
        while ((m = downRex.exec(subject))) {
            if (m.index == downRex.lastIndex) {
                downRex.lastIndex++;
            }
            if (debug) {
                console.log("down", m);
            }
            while (subject.indexOf(m[0]) > -1) {
                subject = subject.replace(m[0], down(m.groups));
            }
        }
    });

    return subject;
};
