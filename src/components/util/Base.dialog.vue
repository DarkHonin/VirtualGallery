<template>
    <dialog class="dialog absolute w-screen h-screen top-0 left-0 flex bg-opacity-75 bg-background3" :class="openClass"
        style="z-index: 999; max-width: 100vw;">
        <Content class="flex justify-end items-stretch mb-0 bg-background2 ">
            <div class="p-2 flex w-full flex-col gap-2 ">
                <div class="flex sticky top-2">
                    <BaseButton @click="handleClose">
                        <BaseIcon name="close" />
                    </BaseButton>
                    <div class="ml-auto flex gap-2">
                        <slot name="actions" />
                    </div>
                </div>
                <div class=" max-h-full">
                    <slot />
                </div>
            </div>
        </Content>
    </dialog>
</template>

<script lang="ts" setup>
import { useDialogControls } from '@/utils/Dialog.compose';
import BaseButton from '../button/Base.button.vue';
import BaseIcon from '../icon/Base.icon.vue';
import { onMounted, ref } from 'vue';
import Content from '../core/Content.vue';

const { closeDialog } = useDialogControls()

const handleClose = () => {
    openClass.value = undefined
    setTimeout(closeDialog, 200)
}

const openClass = ref()

onMounted(() => {
    setTimeout(() => openClass.value = 'open', 100)
})


</script>


<style lang="scss">
dialog.dialog>div {
    transform: translateY(100vh);
    transition: transform .2s;
}

dialog.dialog.open>div {
    transform: translateY(0vh)
}

dialog.dialog .content {
    min-height: 80vh;
    height: min-content;
    max-height: 100vh;
    overflow-y: auto;
}
</style>