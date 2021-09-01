<template>
  <div class="d-flex al-c">
    <v-text-field
      v-if="!options.length"
      persistent-placeholder
      v-model="val"
      :label="$t(`${locales}BuildCommand`)"
      :placeholder="placeholder"
    />
    <v-select
      v-else
      persistent-placeholder
      :menu-props="{ offsetY: true }"
      :label="$t(`${locales}BuildCommand`)"
      :items="options"
      item-text="text"
      item-value="value"
      v-model="val"
    >
      <template #item="{ item }">
        <span>{{ item.key }}</span>
        <span class="gray ml-1 mr-2">:</span>
        <span class="gray fz-13 line-1" style="max-width: 390px">{{
          item.script
        }}</span>
      </template>
    </v-select>

    <e-tooltip bottom max-width="300">
      <template #ref>
        <v-icon size="15" class="ml-2"> mdi-help-circle-outline </v-icon>
      </template>
      <p>
        The command your frontend framework provides for compiling your code.
      </p>
      <p>If your frontend does not require a build, leave this field empty.</p>
    </e-tooltip>
  </div>
</template>

<script>
export default {
  props: {
    value: String,
    placeholder: String,
    scripts: null,
  },
  watch: {
    val() {
      this.$emit("input", this.val);
    },
    value() {
      if (this.value != this.val) this.val = this.value;
    },
  },
  data() {
    return {
      locales: "new.index.",
      val: this.value,
    };
  },
  computed: {
    options() {
      let res = [];
      if (this.scripts) {
        for (const key in this.scripts) {
          const method = /build/.test(key) ? "unshift" : "push";
          let value = "npm run " + key;
          const script = this.scripts[key];
          if (script == "next build") value = script;
          res[method]({
            key,
            text: value,
            value,
            script,
          });
        }
      }
      return res;
    },
  },
};
</script>