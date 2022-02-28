<template>
  <div class="mint-tpl pos-r">
    <div class="ta-c pos-center w90p" style="max-width: 550px">
      <h2>Mint Template</h2>
      <div class="fz-15 mt-8 ta-l">
        <p>
          The current project template is for you to create NFTs, enter the
          contract address to set environment variables and deploy the project.
          Come and try it out!
        </p>
        <p class="color-1">Here is the link to the deployment site.</p>
      </div>
      <div class="mt-15">
        <v-btn
          color="#A27EC6"
          :to="`/new/clone-flow?s=${encodeURIComponent(
            'https://github.com/Mint-Box/mint-box-template'
          )}`"
        >
          <span class="white-0">Deploy</span>
        </v-btn>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.mint-tpl {
  background: #f4e4e6 url(/img/bg/mint-tpl.jpg) center center no-repeat;
  background-size: cover;
  min-height: 70vh;
}
</style>