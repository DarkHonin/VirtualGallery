// import { useActivePost } from "@/db/post.model";
// import { useMediaStore } from "@/stores/Media.store";
// import { usePostStore } from "@/stores/Post.store";

// export const imageParser = () => ({
//     name: "image",
//     level: "inline" as "inline", // Is this a block-level or inline-level tokenizer?

//     renderer(
//         {
//             href,
//             text,
//             title,
//         }: {
//             href: string;
//             text: string;
//             title: string;
//         },
//     ) {
//         const { media } = useActivePost();

//         return `<img src="${media.value?.[href]}" alt="${text}" />`;
//     },
// });
