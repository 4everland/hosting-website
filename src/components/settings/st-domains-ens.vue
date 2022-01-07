<template>
  <div>
    <h3>ENS</h3>
    <div class="gray mt-1 fz-14">Add your ENS to your 4everland site.</div>
    <div class="mt-5 d-flex">
      <v-text-field
        outlined
        dense
        v-model.trim="domain"
        @keyup.enter="onAdd"
        placeholder="ENS Domain"
      >
      </v-text-field>
      <v-btn
        @click="onAdd"
        :disabled="!domain"
        :loading="adding"
        color="primary"
        class="ml-4"
        style="margin-top: 2px"
      >
        Add
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      domain: "",
      adding: false,
    };
  },
  methods: {
    onAdd() {
      //
    },
  },
};
</script>