<template>
  <div class="h-full relative flex flex-col" ref="root">
    <StarfieldGraphic class="w-full h-full fixed top-10" style="z-index: -1;" />
    <div class="m-auto flex flex-col items-center justify-center"
      style="height: minmax(calc(100vh - 2.5em), min-content); min-height: calc(100vh - 2.5em)">
      <BrandGraphic width="500" height="500" />
      <label class="text-4xl underline">HoninWorx</label>
      <label class="text-md text-center p-2">The mad works of a dragon named Honin</label>
      <label class="flex gap-2 justify-center items-center text-center p-2">
        <a href="https://www.youtube.com/@honinworx">
          <MediaIcon class="h-8 w-auto" name="youtube" />
        </a>
        <a href="https://t.me/HoninWorx">
          <MediaIcon class="h-6 w-auto" name="telegram" />
        </a>
        <a href="https://ko-fi.com/honinworx">
          <MediaIcon class="h-6 w-auto" name="ko-fi" />
        </a>
      </label>
      <label class="text-xs p-2 text-center"> Check out these links while this site is getting setup </label>
    </div>
    <GalleryComponent />
  </div>
</template>

<script lang="ts" setup>
import GalleryComponent from '@/components/gallery/Gallery.component.vue';
import ArtworkGalleryItem from '@/components/gallery/Gallery.item.vue';
import BrandGraphic from '@/components/graphics/Brand.graphic.vue';
import StarfieldGraphic from '@/components/graphics/Starfield.graphic.vue';
import MediaIcon from '@/components/icon/Media.icon.vue';
import { useArtworkStore } from '@/stores/Artworks.store';



</script>

<style lang="scss">
.blurred-background {
  backdrop-filter: blur(2px);
  background-color: rgba(100, 100, 100, 0.1);
  box-shadow: rgba(100, 100, 100, 0.1) 0px 0px 50px 50px;
}
</style>