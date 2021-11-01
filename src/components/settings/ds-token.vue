<template>
  <div>
    <div class="bd-1 pd-20">
      <h3>Tokens</h3>
      <div class="gray mt-1 fz-14">
        These tokens allow other apps to control your whole account. Be careful!
      </div>

      <div class="mt-5 ta-r">
        <v-btn small color="primary" @click="clickAdd"> Create </v-btn>
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
    </div>

    <v-dialog v-model="showPop" max-width="500">
      <div class="pd-30">
        <h2>Create Token</h2>
        <div class="gray mt-2 fz-14">
          Enter a name for your token to differentiate it from other tokens.
        </div>
        <div class="mt-5">
          <v-text-field
            persistent-placeholder
            v-model="form.name"
            placeholder="New Token"
            autocomplte="off"
            autofocus
          />
        </div>
        <div class="mt-5 ta-c">
          <v-btn small @click="showPop = false"> Cancel </v-btn>
          <v-btn
            small
            color="primary"
            class="ml-5"
            :loading="adding"
            @click="onAdd"
          >
            Create
          </v-btn>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      headers: [
        { text: "Name", value: "name" },
        { text: "Last Active", value: "time" },
      ],
      list: [],
      selected: [],
      deleting: false,
      showPop: false,
      form: {
        token: "",
      },
      adding: false,
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    clickAdd() {
      this.showPop = true;
    },
    async onAdd() {
      try {
        if (!this.form.name) {
          return this.$toast("Invalid Name");
        }
        this.adding = true;
        await this.$http.post("/project/env/" + this.info.id, this.form);
        this.showPop = false;
        this.form = {
          name: "",
        };
        this.$toast("Added successfully");
        this.getList();
      } catch (error) {
        //
      }
      this.adding = false;
    },
    async onDelete() {
      try {
        const suffix = this.selected.length > 1 ? "s" : "";
        let html = `The following Environment Variable${suffix} will be permanently deleted. Are you sure you want to continue?<ul class='mt-4'>`;
        for (const row of this.selected) {
          html += "<li>" + row.key + "</li>";
        }
        html += "</ul>";
        await this.$confirm(html, "Remove Environment Variable" + suffix);
        this.deleting = true;
        for (const row of this.selected) {
          await this.$http.delete("/project/env?id=" + row.id);
        }
        this.$toast("Deleted successfully");
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
        this.list = data.content.map((it) => {
          it.time = new Date(it.createAt).format();
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