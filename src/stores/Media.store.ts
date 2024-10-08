import { PostStorage, PostTable } from "@/db/post.model";
import { defineStore } from "pinia";
import { decode } from "base64-arraybuffer";

interface MediaStoreState {
    _mediaCache: {
        [postId: number]: {
            [mediaName: string]: string; // Filename : img-src
        };
    };
    _removalCue: string[];
}

const fetchMediaForPost = async (postId: number) => {
    const { data, error } = await PostTable().select("media").eq(
        "id",
        postId,
    ).single();

    if (error) {
        throw error;
    }
    return data.media ?? [];
};

export const useMediaStore = defineStore("Media Store", {
    state: (): MediaStoreState => ({
        _mediaCache: {},
        _removalCue: [],
    }),
    getters: {
        media: ({ _mediaCache }) => (postId: number) => {
            return _mediaCache[postId];
        },
        publicUrl: () => (name: string) => {
            const { data } = PostStorage().getPublicUrl(
                ["posts", name].join("/"),
            );
            return data.publicUrl;
        },
        removedMedia: (_removalCue) => _removalCue,
    },
    actions: {
        async fetchMediaForPost(postId: number) {
            const media = await fetchMediaForPost(postId);
            this._mediaCache[postId] = Object.fromEntries(
                media.map((fileName) => {
                    const { data } = PostStorage().getPublicUrl(
                        ["posts", fileName].join("/"),
                    );
                    return [fileName, data.publicUrl];
                }),
            );
            return this._mediaCache[postId];
        },
        clearMediaCache(postId: number) {
            if (this._mediaCache[postId]) {
                delete this._mediaCache[postId];
            }
        },
        registerMedia(postId: number, file: File) {
            const filename = file.name;
            if (!this._mediaCache[postId]) this._mediaCache[postId] = {};

            if (this._mediaCache[postId][filename]) {
                throw "media already exists";
            }
            const reader = new FileReader();

            reader.onload = () => {
                this._mediaCache[postId][filename] = reader
                    .result! as string;
            };
            reader.readAsDataURL(file);
            return filename;
        },
        removeMedia(postId: number, name: string) {
            if (!this._mediaCache[postId]) this._mediaCache[postId] = {};

            if (!this._mediaCache[postId][name]) return;

            if (!this._mediaCache[postId][name].startsWith("data")) {
                this._removalCue.push(name);
            }

            delete this._mediaCache[postId][name];
        },
        async deleteRemovedMedia() {
            if (!this._removalCue || !this._removalCue.length) return [];
            const toRemove = this._removalCue.map((name) =>
                ["posts", name].join("/")
            );
            const { data, error } = await PostStorage().remove(toRemove);
            if (error) {
                console.error(`Failed to delete media ${name}`);
                throw error;
            }
            const removed: string[] = [...this._removalCue];
            this._removalCue = [];
            return removed;
        },
        publishNewMedia(postId: number) {
            const candidates = Object.entries(this._mediaCache[postId]).filter((
                [name, src],
            ) => src.startsWith("data:image"));
            return Promise.all(candidates.map(([name, src]) => {
                const rex = new RegExp(/^data:(?<type>.+);base64,/);
                const m = rex.exec(src);
                if (!m) {
                    throw "Invalid b64 header";
                }
                const rawB64 = src.replace(m[0], "");

                const filePath = ["posts", name].join("/");
                console.log(m.groups);
                return new Promise<string>((y, n) => {
                    PostStorage().upload(filePath, decode(rawB64), {
                        contentType: m.groups!["type"],
                    })
                        .then(({ error, data }) => {
                            console.log(data, error);
                            if (error) return n(error);

                            y(name);
                        });
                });
            }));
        },
    },
});
