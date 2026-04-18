<script setup lang="ts">
import { computed, onMounted, ref } from 'wevu'

defineComponentJson({
  styleIsolation: 'apply-shared',
})

export interface Tab {
  activeIconClass: string
  iconClass: string
  pagePath: string
  text: string
}

const tabs: Tab[] = [
  {
    activeIconClass: 'i-mdi-home',
    iconClass: 'i-mdi-home-outline',
    pagePath: 'pages/index/index',
    text: '首页',
  },
  {
    activeIconClass: 'i-mdi-view-grid',
    iconClass: 'i-mdi-view-grid-outline',
    pagePath: 'pages/category/index',
    text: '分类',
  },
  {
    activeIconClass: 'i-mdi-cart',
    iconClass: 'i-mdi-cart-outline',
    pagePath: 'pages/cart/index',
    text: '购物车',
  },
  {
    activeIconClass: 'i-mdi-account-circle',
    iconClass: 'i-mdi-account-circle-outline',
    pagePath: 'pages/user/index',
    text: '我的',
  },
]

const currentRoute = ref<string>()
const showFooter = computed(() => tabs.some(item => item.pagePath === currentRoute.value))
const isActive = (item: Tab) => item.pagePath === currentRoute.value

function syncCurrentRoute() {
  const pages = getCurrentPages()
  const currentPage = pages.at(-1)
  currentRoute.value = currentPage?.route || ''
}

function goTab(item: Tab) {
  if (isActive(item)) {
    return
  }
  wx.switchTab({ url: `/${item.pagePath}` })
}

onMounted(() => {
  syncCurrentRoute()
  wx.onAppRoute?.(() => {
    syncCurrentRoute()
  })
})
</script>

<template>
  <view
    v-if="showFooter"
    class="base-footer"
  >
    <view class="base-footer__bar">
      <view
        v-for="item in tabs"
        :key="item.pagePath"
        class="base-footer__item"
        :class="isActive(item) ? 'base-footer__item--active' : ''"
        hover-class="base-footer__item--pressed"
        :hover-start-time="0"
        :hover-stay-time="180"
        @tap="goTab(item)"
      >
        <view class="base-footer__icon-shell">
          <view class="base-footer__press-mask" />
          <view v-if="isActive(item)" class="base-footer__active-glow" />
          <view class="base-footer__icon" :class="[isActive(item) ? item.activeIconClass : item.iconClass]" />
        </view>
        <text class="base-footer__label">
          {{ item.text }}
        </text>
      </view>
    </view>
  </view>
</template>

<style scoped>
.base-footer {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 100;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  background: #f6f7f9;
  border-top: 1rpx solid #edf0f4;
  box-shadow: 0 -8rpx 30rpx rgb(31 45 61 / 6%);
}

.base-footer__bar {
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 106rpx;
  padding: 0 12rpx;
}

.base-footer__item {
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 0;
  color: #303133;
}

.base-footer__item--active {
  color: #2ea8ff;
}

.base-footer__icon-shell {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64rpx;
  height: 64rpx;
  border-radius: 999rpx;
  transition: color 0.2s ease;
}

.base-footer__icon {
  position: relative;
  z-index: 2;
  width: 42rpx;
  height: 42rpx;
  color: currentcolor;
}

.base-footer__active-glow {
  position: absolute;
  top: 8rpx;
  z-index: 1;
  width: 46rpx;
  height: 34rpx;
  background: radial-gradient(circle, rgb(46 168 255 / 55%) 0%, rgb(46 168 255 / 0%) 72%);
  border-radius: 999rpx;
  filter: blur(5rpx);
}

.base-footer__label {
  margin-top: 6rpx;
  font-family: 'SF Pro Text', 'PingFang SC', sans-serif;
  font-size: 20rpx;
  line-height: 1;
  color: currentcolor;
}

.base-footer__item--active .base-footer__icon-shell {
  transform: translateY(-2rpx);
}

.base-footer__item--active .base-footer__label {
  font-weight: 600;
}

.base-footer__press-mask {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: rgb(46 168 255 / 18%);
  border-radius: 999rpx;
  opacity: 0;
  transform: scale(0.4);
}

.base-footer__item--pressed .base-footer__icon-shell {
  background: rgb(46 168 255 / 8%);
}

.base-footer__item--pressed .base-footer__press-mask {
  opacity: 1;
  animation: tabbar-ripple 220ms ease-out forwards;
}

@keyframes tabbar-ripple {
  0% {
    opacity: 0.24;
    transform: scale(0.35);
  }

  100% {
    opacity: 0;
    transform: scale(1);
  }
}
</style>
