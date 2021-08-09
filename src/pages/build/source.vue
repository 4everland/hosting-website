<template>
  <v-card outlined>
    <div class="pd-20">
      <div class="pd-20 ta-c" v-if="isError">
        <v-img src="img/building.svg" width="200" class="m-auto"></v-img>
      </div>
      <v-row v-else>
        <v-col cols="12" md="5">
          <v-skeleton-loader type="article" v-if="initLoading" />
          <v-treeview
            v-else
            :load-children="getFiles"
            @update:active="onActive"
            activatable
            hoverable
            open-on-click
            dense
            :items="dirList"
          >
            <template v-slot:prepend="{ item, open }">
              <v-icon v-if="item.type == 'dir'">
                {{ open ? "mdi-folder-open" : "mdi-folder" }}
              </v-icon>
              <v-icon v-else>
                {{ files[item.ftype] || "mdi-file" }}
              </v-icon>
            </template>
          </v-treeview>
        </v-col>
        <v-col cols="12" md="7" v-if="fileName">
          <v-skeleton-loader type="article" v-if="loading" />
          <div v-else-if="isImg">
            <img :src="result" :alt="fileName" style="max-width: 100%" />
          </div>
          <div v-else class="fz-14 lh-2 ov-a" style="max-height: 80vh">
            {{ result }}
          </div>
        </v-col>
      </v-row>
    </div>
  </v-card>
</template>

<script>
export default {
  data() {
    const { taskId } = this.$route.params;
    return {
      initLoading: true,
      isError: false,
      taskId,
      dirList: [],
      files: {
        html: "mdi-language-html5",
        js: "mdi-nodejs",
        css: "mdi-language-css3",
        json: "mdi-code-json",
        md: "mdi-language-markdown",
        pdf: "mdi-file-pdf",
        ico: "mdi-file-image",
        png: "mdi-file-image",
        svg: "mdi-file-image",
        txt: "mdi-file-document-outline",
        xls: "mdi-file-excel",
      },
      result: null,
      loading: false,
      fileName: null,
      info: null,
    };
  },
  computed: {
    isImg() {
      const ftype = /\.(\w+)$/.exec(this.fileName)[1];
      return /ico|png|jpg|jpeg|gif|svg/.test(ftype);
    },
  },
  mounted() {
    this.initData();
  },
  methods: {
    async initData() {
      try {
        const { data } = await this.$http.get(
          `/project/task/object/${this.taskId}`,
          {
            noTip: 1,
          }
        );
        this.info = data.task;
        await this.getFiles();
      } catch (error) {
        this.isError = true;
      }
    },
    async onActive(it) {
      const [hash, name, dir] = it[0].split(",");
      try {
        this.fileName = name;
        this.loading = true;
        this.result = "";
        const url = `/artifact/deployment/${hash}/file/${name}`;
        if (this.isImg) {
          await this.$sleep(500);
          this.result =
            "//" + this.info.domain + "/" + dir + "/" + this.fileName;
        } else {
          const { data } = await this.$http.get(url);
          // console.log(data)
          this.result = data;
        }
      } catch (error) {
        console.log(error);
      }
      this.loading = false;
    },
    async getFiles(item) {
      const params = {};
      if (item) {
        params.cid = item.hash;
      }
      const { data } = await this.$http.get(
        `/artifact/deployment/${this.taskId}/output`,
        {
          params,
          noTip: true,
        }
      );
      data.forEach((it) => {
        if (it.type == "Directory") {
          it.type = "dir";
          it.children = [];
          it.dir = it.name;
        } else {
          it.ftype = /\.(\w+)$/.exec(it.name)[1];
          it.dir = "";
        }
        if (item) {
          it.dir = item.dir + (it.dir ? "/" + it.dir : "");
        }
        it.id = [it.hash, it.name, it.dir].join(",");
      });
      // console.log(data);
      if (item) {
        item.children.push(...data);
      } else {
        // if(data.length == 1) {
        //   await this.getFiles(data[0])
        // }
        this.dirList = data;
        this.initLoading = false;
      }
    },
  },
};
</script>