<template>
  <div class="wrap-1">
    <div class="con- mt-8">
      <v-card outlined class="pa-8 pt-15 pb-15 m-auto" max-width="500">
        <div class="d-flex al-c">
          <div>
            <img src="img/empty/act-build-suc.png" style="width: 120px" />
          </div>
          <div class="ml-8">
            <h3 style="color: #69c07e">Congratulations!</h3>
            <p class="mt-1 gray fz-13">
              Your project has been successfully deployed.
            </p>
            <div class="mt-7">
              <v-btn color="primary" small class="mr-3 mt-3">
                <span>Visit</span>
                <v-icon size="16">mdi-open-in-new</v-icon>
              </v-btn>
              <v-btn small class="mt-3" to="/dashboard/projects"
                >Open Dashboard</v-btn
              >
            </div>
          </div>
        </div>
      </v-card>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    this.onInit();
  },
  methods: {
    async onInit() {
      try {
        const { data: addr } = await this.$http.get("/activity/ethAddress");
        if (addr) return;
        console.log(addr);
        let html = `
	<div class="fz-13">
		Congration ! 
		<p class="mt-2 ti-2">4EVERLAND the 'First Landing' event aims to discover more developers to help achieve Web3.0 There are 50 million of 4EVER to encourage projects to be deployed on 4everland, where provides global acceleration and long term storage network services.</p>
		<p class="mt-2 ti-2">All participants win their share of 50 million of 4EVER and special NFT. Let's get started and win them all!</p>

		<p class="mt-3">How to participate </p>
		<ul>
		<li>Log in 4EVERLAND via GitHub account</li>
		<li>Successfully deployed a project</li>
		<li>Connected to your domain</li>
		<li>Invite more developers to join</li>
		<li>Apply for DevGrants, which rewards projects and supports them long term developement.</li>
		</ul>
	</div>
`;
        const { value } = await this.$prompt(html, "Spaceman Plan", {
          icon: "mdi-rocket",
          confirmText: "Submit",
          confirmTextAttrs: {
            color: "primary",
            text: false,
          },
          inputAttrs: {
            label: "Wallet Address",
            placeholder: "Please enter your address",
            hint: "Submit your ETH Address, rewards available at the end of the 4EVERLAND FirstLanding.",
            rules: [
              (v) =>
                this.$regMap.eth.test(v) ||
                "Please enter correct eth wallet address.",
            ],
            required: true,
          },
        });
        console.log(value);
        this.$loading();
        await this.$http.put(`/activity/bind/eth/${value}`);
        this.$loading.close();
        this.$toast("Added successfully");
      } catch (error) {
        //
      }
    },
  },
};
</script>