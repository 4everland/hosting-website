<template>
  <a :href="href" target="_blank" v-if="href">
    <slot></slot>
  </a>
  <div v-else>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    href: String,
  },
};
</script>