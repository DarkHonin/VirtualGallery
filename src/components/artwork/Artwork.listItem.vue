<template>
    <div class="group artwork-list-item flex w-full grow gap-2 min-w-32 border"
        :class="{ 'border-2 border-accent border-dashed hover:border-primary-active': !Boolean(item), 'border-primary  hover:border-accent': Boolean(item) }">

        <div v-if="item" :style="{ backgroundImage: `URL(${artworkURL})` }"
            class="aspect-square bg-cover bg-center flex ">

            <div class="p-2 w-full mt-auto opacity-25 group-hover:opacity-100 transition-all bg-primary">
                <label class="underline">{{ item.title }}</label>
                <p class="max-h-6 text-ellipsis overflow-hidden overflow-y-hidden group-hover:max-h-28 transition-all">
                    {{
                        item.description }}</p>
            </div>

        </div>


        <BaseIcon v-else class="m-auto scale-150" name="add" />

    </div>
</template>

<script lang="ts" setup>
import { useArtwork, type Artwork } from '@/db/artwork.model';
import { computed } from 'vue';
import BaseIcon from '../icon/Base.icon.vue';


const props = defineProps<{
    item?: Artwork
}>()

const artworkURL = computed(() => {
    if (!props.item) return undefined
    const { imagePublicUrl } = useArtwork(props.item)
    return imagePublicUrl.value
})


</script>