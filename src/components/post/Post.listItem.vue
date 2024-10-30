<template>
    <div ref="root" class="flex h-64 bg-background2 post-list-item w-full flex-col md:flex-row  relative">
        <div class="absolute w-full h-full flex justify-center items-center z-0 overflow-hidden background-image opacity-0"
            ref="backdrop">
            <div v-for="(i, index) in media" :key="i.name" class="h-screen bg-center rotate-45 absolute left-0"
                :style="{ backgroundImage: `URL(${i.url})`, width: `${(1 / media.length) * 100}%`, left: `${(index / media.length) * 100}%` }">

            </div>
        </div>
        <div class=" flex flex-col min-w-64 p-2 z-10 meta">
            <h2>{{ post?.title }}</h2>
            <h3>{{ publicationDate }}</h3>
        </div>
        <div class="overflow-hidden flex-1 w-full z-10 content">
            <div v-html="post?.content" class="markup">

            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { usePost as usePost, type Post } from '@/db/post.model';
import { computed, onMounted, ref } from 'vue';

const props = defineProps<{
    item?: Post
}>()

const { media, post, coverImage, publicationDate } = usePost(computed(() => props.item))

const root = ref<HTMLElement>()
const backdrop = ref<HTMLElement>()

onMounted(() => {
    setTimeout(() => backdrop.value?.classList.add("opacity-100"), 1000)
})

</script>

<style lang="scss">
.post-list-item {

    .meta {
        background: linear-gradient(90deg, black, transparent);
    }

    .background-image {
        transition: opacity 1s;
    }

    .content>.markup {
        width: 100%;
        height: 100%;
        content: "";
        top: 0px;
        left: 0px;
        position: absolute;
        mask-image: linear-gradient(180deg, #000 60%, transparent 90%);
    }

    .meta,
    .content {
        backdrop-filter: brightness(50%) contrast(150%);
        transition: backdrop-filter .2s;

        $distance: 1px;
        $spread: 0px;

        h1,
        h2,
        h3,
        p {
            filter: drop-shadow($distance $distance $spread black) drop-shadow($distance (
                    -$distance) $spread black) drop-shadow((-$distance) (-$distance) $spread black) drop-shadow((-$distance) $distance $spread black
            );
    }

}

&:hover {

    .meta,
    .content {
        backdrop-filter: brightness(100%) contrast(100%);

    }
}

.markup {
    * {
        display: none;
    }


    p:nth-of-type(-n+3) {
        display: block
    }

}
}
</style>