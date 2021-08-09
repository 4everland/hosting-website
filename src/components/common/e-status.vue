<template>
  <div v-if="val">
    <span class="dot-1" :class="'c-' + state"></span>
    <span class="sta-1" :class="'c-' + state">{{ state.capitalize() }}</span>
  </div>
</template>

<script>
export default {
  props: {
    val: String,
  },
  computed: {
    state() {
      return this.val.toLowerCase();
    },
  },
};
</script>