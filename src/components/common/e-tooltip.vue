<template>
  <v-tooltip v-bind="$attrs">
    <template v-slot:activator="{ on, attrs }">
      <span v-bind="attrs" v-on="on">
        <slot name="ref"></slot>
      </span>
    </template>
    <span>
      <slot></slot>
    </span>
  </v-tooltip>
</template>
