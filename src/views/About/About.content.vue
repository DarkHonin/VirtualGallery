<template>
    <div class="m-auto">
        <div class="bg-background2">
            <BrandGraphic width="300" height="300" class="m-auto" />
        </div>
        <div class="h-full flex flex-1 flex-col bg-background2 z-10 justify-center items-center px-4 w-full">
            <div style="display: flex; flex-direction: column; align-items: center;">
                <h2 style="text-decoration: underline;">
                    Welcome to this place
                </h2>
                <p class="text-center p-2">
                    Many years ago I decided my mission would be to explore and create as much as I possibly could
                    with whatever I can get my hands on.
                </p>
                <p class="text-center p-2">
                    Since then I have grown up and shed the naivety that this would be easy.
                    <br>
                    The most challenging aspect has been documentation, not only to sit down and write it but also
                    devising effective presentation.
                </p>
                <hr>
                <h2 class="underline">The point</h2>
                <p class="text-center p-2">
                    With the intro out of the way.<br><br> The goal of this page/project is to provide a platform for
                    documenting
                    and showcasing the projects as they are ongoing.<br>
                    Theres allot I want to do here, as one of the goals is to migrate off away from <span
                        class="font-mono text-negative">big tech</span> and their fickle policies.
                </p>
                <hr>
                <h2>What is:

                    <BrandGraphic width="100" height="100" class="inline" />
                </h2>
                <p class="text-center p-2">
                    As most conquests need a banner so did this one.<br>
                    Conceived originally as 2 hands grasping an orb it symbolizes the act of grasping/mastering a
                    subject or art form.
                    <br>
                    <br>
                    Since then its grown more abstract as I have now mastered some skills and art forms its become more
                    <i>emissive</i>. Reflecting the desire to not only "reach for" but also <i>radiate</i> what has been
                    learned so far.

                </p>
                <hr>
                <h2>Who am I?
                </h2>
                <p class="text-center p-2">
                    I dont know what to write here yet. Guess were on the same page in that regard then. I dont know
                    either.
                </p>
                <hr>
                <p class="text-center p-2">
                    This page is likely to undergo drastic changes at random times.<br>
                    Be sure to check back often to see what changes.<br>
                    <br>
                    In the meantime, I do post on these platforms infrequently :3
                </p>
            </div>
            <SocialLinks />
        </div>
    </div>
</template>

<script lang="ts" setup>

import SocialLinks from '@/components/core/SocialLinks.vue';
import BrandGraphic from '@/components/graphics/Brand.graphic.vue';
import BaseIcon from '@/components/icon/Base.icon.vue';
import MediaIcon from '@/components/icon/Media.icon.vue';

</script>