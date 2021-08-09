<template>
  <div class="pos-r bg-proj-1">
    <div class="y-center w100p d-flex al-c pd-20">
      <div class="white-0">
        <div class="fz-18">{{ title }}</div>
        <div class="mt-1 white-5 fz-14">
          <slot></slot>
        </div>
      </div>
      <div class="ml-auto">
        <slot name="right"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
  },
};
</script>