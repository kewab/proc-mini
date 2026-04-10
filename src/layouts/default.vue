<script setup lang="ts">
import { computed, onMounted, ref } from 'wevu'
import Navbar from '@/components/application/navbar.vue'
import Tabbar from '@/components/application/tabbar.vue'
import CartDetailSheet from '@/components/cart/CartDetailSheet.vue'
import CartSummaryBar from '@/components/cart/CartSummaryBar.vue'

defineComponentJson({
  component: true,
  usingComponents: {
    't-dialog': 'tdesign-miniprogram/dialog/dialog',
    't-toast': 'tdesign-miniprogram/toast/toast',
  },
})

const currentRoute = ref('')

const tabRoutes = ['pages/index/index', 'pages/category/index', 'pages/cart/index', 'pages/user/index']
const customNavbar = [...tabRoutes]
const showNavbar = computed(() => !customNavbar.includes(currentRoute.value))
const showCartSummary = computed(() => tabRoutes.includes(currentRoute.value) && currentRoute.value !== 'pages/cart/index')
const layoutBottomInset = computed(() => showCartSummary.value
  ? 'calc(220rpx + env(safe-area-inset-bottom))'
  : 'calc(98rpx + env(safe-area-inset-bottom))')

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
  <view class="layout-default" :style="{ paddingBottom: layoutBottomInset }">
    <Navbar v-if="showNavbar" />
    <slot />
    <CartSummaryBar v-if="showCartSummary" />
    <Tabbar />
    <CartDetailSheet />
    <t-toast layout-host="layout-toast" />
    <t-dialog layout-host="layout-dialog" />
  </view>
</template>

<style>
.layout-default {
  min-height: 100%;
}
</style>
