<template>
  <div>
    <div class="d-flex al-c">
      <div class="mr-5">
        <h3>Environment Variable</h3>
        <div class="gray mt-1 fz-14">
          In order to provide your Deployment with Environment Variables at
          Build and Runtime,you may enter them right here,for the Environment of
          your choice.
        </div>
      </div>
    </div>

    <div class="mt-5 ta-r">
      <v-btn small color="primary" @click="showPop = true"> Add </v-btn>
      <v-btn
        small
        color="error"
        class="ml-5"
        @click="onDelete"
        :loading="deleting"
        :disabled="selected.length == 0"
        v-if="list.length > 0"
      >
        Delete
      </v-btn>
    </div>

    <div class="mt-3">
      <v-data-table
        class="elevation-1"
        v-model="selected"
        :loading="loading"
        :show-select="list.length > 0"
        item-key="id"
        :headers="headers"
        :items="list"
        hide-default-footer
      ></v-data-table>
    </div>

    <v-dialog v-model="showPop" max-width="500">
      <div class="pd-20">
        <h3>Add New</h3>
        <div class="mt-5">
          <v-text-field
            persistent-placeholder
            v-model="form.key"
            label="Name"
            placeholder="Example_Name"
          />
          <v-text-field
            persistent-placeholder
            v-model="form.value"
            label="Value"
            placeholder="19JU23NF3898FUUH"
          />
        </div>
        <div class="mt-5 ta-r">
          <v-btn small @click="showPop = false"> Cancel </v-btn>
          <v-btn
            small
            color="primary"
            class="ml-5"
            :loading="adding"
            @click="onAdd"
          >
            Add
          </v-btn>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    info: Object,
  },
  data() {
    return {
      loading: false,
      headers: [
        { text: "Name", value: "key" },
        { text: "Value", value: "value" },
        { text: "Created", value: "time" },
      ],
      list: [],
      selected: [],
      deleting: false,
      showPop: false,
      form: {
        key: "",
        value: "",
      },
      adding: false,
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    async onAdd() {
      try {
        if (!this.form.key) {
          return this.$toast("Invalid Name");
        }
        this.adding = true;
        await this.$http.post("/project/env/" + this.info.id, this.form);
        this.showPop = false;
        this.$toast("added successfully");
        this.getList();
      } catch (error) {
        //
      }
      this.adding = false;
    },
    async onDelete() {
      try {
        this.deleting = true;
        for (const row of this.selected) {
          await this.$http.delete("/project/env?id=" + row.id);
        }
        this.$toast("deleted successfully");
      } catch (error) {
        //
      }
      this.selected = [];
      this.deleting = false;
      this.getList();
    },
    async getList() {
      try {
        this.loading = true;
        const { data } = await this.$http.get(`/project/env/${this.info.id}`);
        // console.log(data)
        const now = new Date();
        this.list = data.content.map((it) => {
          it.time = new Date(it.createAt).toNiceTime(now);
          return it;
        });
      } catch (error) {
        //
      }
      this.loading = false;
    },
  },
};
</script>