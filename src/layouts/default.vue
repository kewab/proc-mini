<script setup lang="ts">
import { computed, onMounted, ref } from 'wevu'
import Navbar from '@/components/application/navbar.vue'
import Tabbar from '@/components/application/tabbar.vue'

defineComponentJson({
  component: true,
  usingComponents: {
    't-dialog': 'tdesign-miniprogram/dialog/dialog',
    't-toast': 'tdesign-miniprogram/toast/toast',
  },
})

const currentRoute = ref('')

const customNavbar = ['pages/index/index', 'pages/category/index', 'pages/cart/index', 'pages/user/index']
const showNavbar = computed(() => !customNavbar.includes(currentRoute.value))

function syncRoute() {
  const currentPage = getCurrentPages().at(-1)
  currentRoute.value = currentPage?.route || ''
}

onMounted(() => {
  syncRoute()
  wx.onAppRoute?.(() => {
    syncRoute()
  })
})
</script>

<template>
  <view class="layout-default">
    <Navbar v-if="showNavbar" />
    <slot />
    <Tabbar />
    <t-toast layout-host="layout-toast" />
    <t-dialog layout-host="layout-dialog" />
  </view>
</template>

<style>
.layout-default {
  min-height: 100%;
  padding-bottom: calc(98rpx + env(safe-area-inset-bottom));
  padding-bottom: calc(98rpx + constant(safe-area-inset-bottom));
}
</style>
