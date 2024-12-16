<template>
    <div class="dialog absolute w-screen h-screen top-0 left-0 flex bg-opacity-75 bg-background3"
        style="z-index: 999; max-width: 100vw;">
        <div class="bg-background2 p-2 m-auto min-w-64 max-w-3xl flex flex-col gap-2">
            <div class="flex">
                <BaseButton @click="closeDialog">
                    <BaseIcon name="close" />
                </BaseButton>
                <div class="ml-auto flex gap-2">
                    <slot name="actions" />
                </div>
            </div>
            <div class="overflow-y-auto " style="max-height: 80vh;">
                <slot />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useDialogControls } from '@/utils/Dialog.compose';
import BaseButton from '../button/Base.button.vue';
import BaseIcon from '../icon/Base.icon.vue';

const { closeDialog } = useDialogControls()


</script>
