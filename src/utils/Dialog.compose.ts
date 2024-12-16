import BaseDialog from "@/components/util/Base.dialog.vue";
import { type Component, ref } from "vue";

const dialogSession = ref<{
    onClose?: { (): void };
    onSubmit?: { (...args: any[]): void };
    component: Component;
    props?: Object;
}>();

export const openDialog = (
    component: Component = BaseDialog,
    props?: Object,
) => {
    dialogSession.value = {
        component,
        props,
    };

    const chain = {
        onSubmit: (cb: { (...args: any[]): void }) => {
            dialogSession.value!.onSubmit = cb;
        },
        onClose: (cb: { (): void }) => {
            dialogSession.value!.onClose = cb;
        },
    };

    return chain;
};

export const useDialogBinding = () => {
    return {
        dialogSession,
    };
};

export const useDialogControls = () => {
    const closeDialog = () => {
        if (dialogSession.value && dialogSession.value.onClose) {
            dialogSession.value.onClose();
        }

        dialogSession.value = undefined;
    };

    const submitDialog = (...args: any[]) => {
        if (dialogSession.value && dialogSession.value.onSubmit) {
            dialogSession.value.onSubmit(...args);
        }

        dialogSession.value = undefined;
    };

    return {
        closeDialog,
        submitDialog,
    };
};
