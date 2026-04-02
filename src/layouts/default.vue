<script setup lang="ts">
import BaseFooter from '@/components/base-footer/index.vue'

defineComponentJson({
  component: true,
  usingComponents: {
    't-dialog': 'tdesign-miniprogram/dialog/dialog',
    't-toast': 'tdesign-miniprogram/toast/toast',
  },
})
</script>

<template>
  <view class="layout-default">
    <slot />
    <BaseFooter />
    <t-toast layout-host="layout-toast" />
    <t-dialog layout-host="layout-dialog" />
  </view>
</template>

<style>
.layout-default {
  min-height: 100%;
}
</style>
