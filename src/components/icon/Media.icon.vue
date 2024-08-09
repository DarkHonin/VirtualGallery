<template>
    <BaseIcon v-bind="props">
        <img v-bind="$attrs" :src="mediaIconMapping[name]" />
    </BaseIcon>
</template>

<script lang="ts" setup>
import BaseIcon from './Base.icon.vue';
import { mediaIconMapping, type MediaIconProps } from './icon.type';

const props = defineProps<MediaIconProps>()





</script>