<template>
  <div class="d-flex al-c f-center" v-if="domain">
    <a
      :style="{
        color,
      }"
      class="u line-1"
      :href="domain"
      target="_blank"
    >
      <slot>
        {{ domain.replace("https://", "").cutStr(12, 13) }}
      </slot>
    </a>
    <v-icon
      v-if="!noCopy"
      size="14"
      class="pa-1 hover-1"
      :class="{
        'anim-shine': notice,
      }"
      v-clipboard="domain"
      @success="$toast('Copied to clipboard !')"
      :color="color"
      >mdi-content-copy</v-icon
    >
  </div>
</template>

<script>
export default {
  props: {
    domain: String,
    notice: Boolean,
    noCopy: Boolean,
    color: {
      type: String,
      default: "white",
    },
  },
};
</script>