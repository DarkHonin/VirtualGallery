<template>
    <BaseDialog>
        <template v-slot="">
            <pre class="p-2 text-wrap">{{ message }}</pre>
            <div class="flex justify-between">
                <BaseButton :color="confirmColor ?? 'positive'" @click="submitDialog(true)">
                    {{ confirmText ?? 'Confirm' }}
                </BaseButton>

                <BaseButton :color="rejectColor ?? 'negative'" @click="closeDialog">
                    {{ rejectText ?? "Abort" }}
                </BaseButton>
            </div>
        </template>
    </BaseDialog>
</template>

<script lang="ts" setup>
import { computed, ref, toRef } from 'vue';
import BaseButton from '../button/Base.button.vue';
import BaseDialog from '../util/Base.dialog.vue';
import { uploadFileAsync } from '@/utils/asyncFileUpload';
import { useDialogControls } from '@/utils/Dialog.compose';
import BaseIcon from '../icon/Base.icon.vue';
import { usePostEditStore } from '@/stores/PostEditor.store';
import type { BaseButtonProps } from '../button/button.types';

const props = defineProps<{
    message: string,
    confirmText?: string
    rejectText?: string,
    confirmColor?: BaseButtonProps['color'],
    rejectColor?: BaseButtonProps['color']
}>()

const { submitDialog, closeDialog } = useDialogControls()


</script>