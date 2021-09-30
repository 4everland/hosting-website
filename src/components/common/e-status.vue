<template>
  <div v-if="val" class="line-1" style="max-width: 110px">
    <span class="dot-1" :class="staCls"></span>
    <span class="sta-1" :class="staCls">{{ state.capitalize() }}</span>
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
    staCls() {
      let cls = "";
      if (this.state == "success") cls = "c-success";
      else if (/fail|error|cancel|timeout/i.test(this.state)) cls = "c-error";
      return cls;
    },
  },
};
</script>