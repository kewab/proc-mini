<script setup lang="ts">
import { computed, onMounted, ref } from 'wevu'

defineComponentJson({
  styleIsolation: 'apply-shared',
})

export interface Tab {
  iconPath?: string
  pagePath: string
  selectedIconPath?: string
  text: string
}

const tabs: Tab[] = [
  {
    pagePath: 'pages/index/index',
    text: '首页',
    iconPath: '/tabbar/index.png',
    selectedIconPath: '/tabbar/indexd.png',
  },
  {
    pagePath: 'pages/category/index',
    text: '分类',
    iconPath: '/tabbar/cate.png',
    selectedIconPath: '/tabbar/cated.png',
  },
  {
    pagePath: 'pages/cart/index',
    text: '购物车',
    iconPath: '/tabbar/cart.png',
    selectedIconPath: '/tabbar/cartd.png',
  },
  {
    pagePath: 'pages/user/index',
    text: '我的',
    iconPath: '/tabbar/user.png',
    selectedIconPath: '/tabbar/userd.png',
  },
]

const currentRoute = ref<string>()
const showFooter = computed(() => tabs.some(item => item.pagePath === currentRoute.value))

function goTab(item: Tab) {
  wx.switchTab({ url: `/${item.pagePath}` })
}

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages.at(-1)
  currentRoute.value = currentPage?.route || ''
})
</script>

<template>
  <view
    v-if="showFooter"
    class="base-footer fixed bottom-0 left-0 right-0 z-[100] border-t border-[#edf0f4] bg-white shadow-[0_-8rpx_30rpx_rgba(31,45,61,0.06)]"
  >
    <view class="flex h-[98rpx] items-center justify-around px-[12rpx]">
      <view
        v-for="item in tabs"
        :key="item.pagePath"
        class="flex min-w-[150rpx] flex-1 flex-col items-center justify-center"
        @tap="goTab(item)"
      >
        <image
          class="h-[40rpx] w-[40rpx]"
          :src="item.pagePath === currentRoute ? item.selectedIconPath : item.iconPath"
          mode="aspectFit"
        />
        <text
          class="mt-[8rpx] text-[24rpx] leading-none"
          :class="item.pagePath === currentRoute ? 'text-[#e93323]' : 'text-[#333]'"
        >
          {{ item.text }}
        </text>
      </view>
    </view>
  </view>
</template>

<style scoped>
.base-footer {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
