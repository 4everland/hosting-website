<template>
  <div class="d-flex al-c mt-2 fz-13" v-if="info && info.domain">
    <span
      class="dot-1 mr-1"
      :class="'c-' + (info.state || 'empty').toLowerCase()"
    ></span>
    <template v-if="type == 'Production' && !info.state">
      <span class="gray">No Production Deployment</span>
    </template>
    <template
      class="d-flex al-c shrink-1"
      v-ripple
      @click.prevent="onClick"
      v-else
    >
      <a
        class="line-1 shrink-1 b"
        :href="`#/build/${name}/${info.taskId}/overview`"
      >
        {{ info.domain }}
      </a>
      <span class="bd-1 bg-f8 ml-3 mr-3 pl-2 pr-2 bdrs-5 fz-12 shrink-0">
        {{ type }}
      </span>
      <span class="gray shrink-0">
        <e-time>{{ info.updateAt }}</e-time>
      </span>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    name: String,
    type: String,
    info: Object,
  },
  computed: {},
  methods: {},
};
</script>