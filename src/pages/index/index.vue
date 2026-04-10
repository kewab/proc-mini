<script setup lang="ts">
import type { HomeActivityItem, HomeGoodsItem, HomeNavItem } from '@/mock/home'
import { computed, onMounted, onPageScroll, onUnmounted, ref } from 'wevu'
import errorNetworkImage from '@/assets/images/home/error-network.png'
import { usePullDownRefresh } from '@/hooks/usePullDownRefresh'
import { useToast } from '@/hooks/useToast'
import { createHomePageMockData } from '@/mock/home'
import AddTips from './components/AddTips.vue'
import HomeGoodsList from './components/HomeGoodsList.vue'
import HomeHeader from './components/HomeHeader.vue'
import HomeModules from './components/HomeModules.vue'

definePageJson({
  navigationBarTitleText: '首页',
  enablePullDownRefresh: true,
  backgroundColor: '#f6f7fb',
  navigationStyle: 'custom',
})

const { showToast } = useToast()

const refreshSeed = ref(0)
const networkError = ref(false)
const navSolidBackground = ref(false)
const updatedAt = ref(`更新于 ${new Date().toLocaleTimeString()}`)
const homeData = ref(createHomePageMockData(refreshSeed.value))
const headerBackgroundImage = ref(homeData.value.banners[0]?.image || '')
let restoreNativePageScroll: (() => void) | null = null

const pageSubtitle = computed(() => networkError.value ? '网络已断开，点击右上角图标重试' : '今日推荐供应商 15 家，活动 2 场')

function refreshHomePage() {
  refreshSeed.value += 1
  homeData.value = createHomePageMockData(refreshSeed.value)
  headerBackgroundImage.value = homeData.value.banners[0]?.image || ''
  updatedAt.value = `更新于 ${new Date().toLocaleTimeString()}`
  showToast('首页数据已刷新')
}

function tapSearch() {
  showToast('搜索功能开发中', 'default')
}

function tapNotice() {
  showToast('暂无新消息', 'default')
}

function tapNav(item: HomeNavItem) {
  showToast(`${item.name} 功能开发中`, 'default')
}

function tapActivity(item: HomeActivityItem) {
  showToast(`${item.title} 功能开发中`, 'default')
}

function tapGoods(item: HomeGoodsItem) {
  showToast(`已选中 ${item.title}`, 'default')
}

function reconnect() {
  networkError.value = false
  refreshHomePage()
}

function toggleNetworkError() {
  networkError.value = !networkError.value
  showToast(networkError.value ? '已切换为断网模拟' : '已恢复联网模拟', 'default')
}

function closeTips() {
  showToast('已关闭顶部提示', 'default')
}

function handleBannerChange(payload: { detail?: { image?: string }, image?: string } | undefined) {
  const nextImage = payload?.detail?.image || payload?.image || ''
  if (nextImage) {
    headerBackgroundImage.value = nextImage
  }
}

function updateNavByScrollTop(scrollTop: number) {
  const isSolid = scrollTop > 40
  if (isSolid !== navSolidBackground.value) {
    navSolidBackground.value = isSolid
  }
}

function bindNativePageScrollFallback() {
  const page = getCurrentPages().at(-1) as { onPageScroll?: (event: any) => void } | undefined
  if (!page || typeof page.onPageScroll !== 'function') {
    return
  }

  const originalOnPageScroll = page.onPageScroll
  page.onPageScroll = (event: { scrollTop?: number }) => {
    updateNavByScrollTop(event?.scrollTop || 0)
    originalOnPageScroll.call(page, event)
  }

  restoreNativePageScroll = () => {
    page.onPageScroll = originalOnPageScroll
  }
}

onMounted(() => {
  headerBackgroundImage.value = homeData.value.banners[0]?.image || ''
  bindNativePageScrollFallback()
})

onPageScroll((event) => {
  updateNavByScrollTop(event?.scrollTop || 0)
})

onUnmounted(() => {
  restoreNativePageScroll?.()
  restoreNativePageScroll = null
})

usePullDownRefresh(refreshHomePage)
</script>

<template>
  <view class="home-page">
    <view class="home-page__hero">
      <image
        v-if="headerBackgroundImage"
        :src="headerBackgroundImage"
        mode="aspectFill"
        class="home-page__hero-image"
      />
      <view v-else class="home-page__hero-fallback" />
      <view
        class="home-page__hero-mask"
        :class="navSolidBackground ? 'home-page__hero-mask--solid' : ''"
      />
    </view>

    <HomeHeader
      title="采购首页"
      :subtitle="pageSubtitle || ''"
      :updated-at="updatedAt || ''"
      :solid-background="navSolidBackground"
      @search="tapSearch"
      @notice="tapNotice"
      @toggle-network="toggleNetworkError"
    />

    <view class="home-page__content">
      <view v-if="networkError" class="network-error">
        <image :src="errorNetworkImage" mode="aspectFit" class="network-error__image" />
        <text class="network-error__title">网络连接断开</text>
        <view class="network-error__desc">
          <text class="network-error__line">请检查是否已开启网络权限</text>
          <text class="network-error__line">当前是否处于弱网环境</text>
          <text class="network-error__line">版本是否过低，升级后重试</text>
        </view>
        <view class="network-error__button" @tap="reconnect">
          重新连接
        </view>
      </view>

      <view v-else>
        <HomeModules
          :banners="homeData.banners"
          :nav-items="homeData.navItems"
          :activities="homeData.activities"
          @banner-change="handleBannerChange"
          @tap-nav="tapNav"
          @tap-activity="tapActivity"
        />
        <HomeGoodsList
          :goods="homeData.goods"
          :updated-at="updatedAt || ''"
          @tap-goods="tapGoods"
        />
      </view>
    </view>

    <AddTips
      :text="homeData.tips.text || ''"
      :storage-key="homeData.tips.storageKey || ''"
      @close="closeTips"
    />
  </view>
</template>

<style scoped lang="scss">
.home-page {
  @apply relative min-h-screen overflow-hidden bg-[#f6f7fb] pb-[240rpx];
}

.home-page__hero {
  @apply pointer-events-none absolute left-0 right-0 top-0 h-[420rpx] overflow-hidden;
}

.home-page__hero-image {
  @apply absolute inset-[-36rpx] h-[calc(100%+72rpx)] w-[calc(100%+72rpx)] scale-110;

  filter: blur(28rpx);
}

.home-page__hero-fallback {
  @apply absolute inset-0 bg-gradient-to-r from-[#f25d34] to-[#ff8447];
}

.home-page__hero-mask {
  @apply absolute inset-0 bg-gradient-to-b from-[rgba(10,18,30,0.16)] via-[rgba(10,18,30,0.32)] to-[#f6f7fb] transition-colors duration-300;
}

.home-page__hero-mask--solid {
  @apply bg-white;
}

.home-page__content {
  @apply relative z-[1] pb-[24rpx];
}

.network-error {
  @apply mx-[28rpx] mt-[30rpx] rounded-[24rpx] bg-white px-[24rpx] pb-[30rpx] pt-[22rpx] text-center shadow-[0_12rpx_32rpx_rgba(15,23,42,0.09)];
}

.network-error__image {
  @apply mx-auto h-[340rpx] w-[340rpx];
}

.network-error__title {
  @apply mt-[8rpx] block text-[34rpx] font-semibold text-[#111827];
}

.network-error__desc {
  @apply mt-[14rpx] rounded-[16rpx] bg-[#fff7ed] p-[18rpx] text-left;
}

.network-error__line {
  @apply block text-[24rpx] leading-[38rpx] text-[#9a3412];
}

.network-error__button {
  @apply mx-auto mt-[26rpx] inline-flex min-w-[240rpx] items-center justify-center rounded-[999rpx] bg-[#f25d34] px-[40rpx] py-[16rpx] text-[28rpx] font-medium text-white;
}
</style>
