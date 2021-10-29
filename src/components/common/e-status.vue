<template>
  <div v-if="val" class="line-1 shrink-0">
    <span class="dot-1" :class="staCls"></span>
    <span class="sta-1" :class="staCls" v-if="!hideText">{{ state.capitalize() }}</span>
  </div>
</template>

<script>
export default {
  props: {
    val: String,
    hideText: Boolean,
  },
  computed: {
    state() {
      return this.val.toLowerCase();
    },
    staCls() {
      let cls = "";
      if (this.state == "success") cls = "c-success";
      else if (/fail|error|cancel|timeout/i.test(this.state)) cls = "c-error";
      return cls;
    },
  },
};
</script>