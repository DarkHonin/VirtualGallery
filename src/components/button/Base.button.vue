<template>
    <div class="relative button-base">
        <button v-if="type == 'button'"
            class="button-base__control border-button-border border-2 px-2 rounded my-2  active:bg-primary-active select-none text-center disabled:cursor-not-allowed"
            :class="colors[color]" :disabled="disabled || loading">
            <slot>
                {{ label }}
            </slot>
        </button>
        <input v-if="type == 'submit'" :value="label" :disabled="disabled || loading" type="submit"
            class="button-base__control p-2 rounded my-2  w-full active:bg-primary-active select-none text-center disabled:opacity-50 disabled:cursor-not-allowed"
            :class="colors[color]" />
        <BaseLoader class="absolute bottom-1 left-0" :loading="loading" />
    </div>
</template>

<script setup lang="ts">

import { type BaseButtonProps } from './button.types'
import BaseLoader from '../loader/Base.loader.vue'

const props =
    withDefaults(
        defineProps<BaseButtonProps>(),
        {
            type: () => "button",
            color: () => 'primary'
        }
    )

const colors = {
    primary: "bg-primary",
    positive: "bg-positive",
    negative: "bg-negative",
}

</script>

<style lang="scss">
.button-base {
    &__control {
        transition: filter .5s;
        filter: brightness(1);

        &[disabled] {
            filter: brightness(.5);
        }

        &:not([disabled]):hover {
            filter: brightness(.8);
        }
    }

}
</style>