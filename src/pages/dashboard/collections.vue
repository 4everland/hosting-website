<template>
  <div>
    <v-dialog max-width="420" v-model="showPop">
      <div class="pd-10-20 bg-gray-e d-flex al-c">
        <b class="fz-14">{{ curItem.title }}</b>
        <div class="ml-auto pa-1 hover-1" @click="showPop = false">
          <v-icon size="20">mdi-close</v-icon>
        </div>
      </div>
      <div class="pd-20">
        <img :src="curItem.img" class="w100p d-b mb-3" />
        <v-row>
          <v-col cols="12" md="6">
            <h4>Description</h4>
            <div class="pa-2 mt-1 bg-f5 gray-3 fz-14">
              {{ curItem.desc }}
            </div>
          </v-col>
          <v-col cols="12" md="6">
            <h4>Details</h4>
            <div
              class="mt-2 d-flex al-c space-btw fz-13"
              v-for="i in 3"
              :key="i"
            >
              <span class="gray">Owned by</span>
              <span class="color-1">address</span>
            </div>
          </v-col>
        </v-row>
      </div>
    </v-dialog>
    <v-card outlined>
      <div class="pd-15-20 bdb-1 d-flex al-c">
        <b class="fz-16">My Collections</b>
        <span class="gray ml-auto fz-14">Connect</span>
      </div>
      <div class="pd-20">
        <div class="ta-c pa-10" v-if="!list.length">
          <img src="img/empty/bill.svg" style="height: 150px" />
          <p class="mt-4 fw-b">No NFTs to display</p>
          <p class="mt-1 gray-a fz-14">
            Please follow us for future limited NFT
          </p>
        </div>
        <div v-else class="pb-3">
          <p class="fz-14 fw-b mb-4">Total: {{ list.length }}</p>
          <v-row>
            <v-col cols="12" md="4" v-for="(it, i) in list" :key="i">
              <v-card @click="onItem(it)">
                <v-img :src="it.img" height="300"></v-img>
                <div class="pd-15-20">
                  <p class="fw-b fz-15 gray-6">{{ it.title }}</p>
                  <p class="gray fz-12">{{ it.title }} #{{ it.id }}</p>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showPop: false,
      list: [
        {
          title: "Firstlanding",
          id: 0,
          img: "https://gateway.pinata.cloud/ipfs/Qmcnz5HGgGgJHZqnhGj1PhjgJzHUYZ8Sxs2h4rHkmQ8xRK",
          desc: "this is a test",
        },
      ],
      curItem: {},
    };
  },
  methods: {
    onItem(it) {
      this.curItem = it;
      this.showPop = true;
    },
  },
};
</script>