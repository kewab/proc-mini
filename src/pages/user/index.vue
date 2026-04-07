<script setup lang="ts">
import { onMounted, ref } from 'wevu'
import goodsImage from '@/assets/images/home/goods-1.png'

definePageJson({
  navigationBarTitleText: '我的',
  enablePullDownRefresh: true,
  backgroundColor: '#f6f7fb',
  navigationStyle: 'custom',
})

interface EntryItem {
  iconClass: string
  id: string
  name: string
}

interface RecommendItem {
  id: string
  image: string
  price: number
  title: string
}

const orderEntries: EntryItem[] = [
  { id: 'pending-pay', name: '待付款', iconClass: 'i-mdi-wallet-outline' },
  { id: 'pending-send', name: '待发货', iconClass: 'i-mdi-package-variant-closed' },
  { id: 'pending-receive', name: '待收货', iconClass: 'i-mdi-truck-delivery-outline' },
  { id: 'pending-comment', name: '待评价', iconClass: 'i-mdi-message-text-outline' },
  { id: 'all-order', name: '全部订单', iconClass: 'i-mdi-clipboard-text-outline' },
]

const toolEntries: EntryItem[] = [
  { id: 'setting', name: '设置', iconClass: 'i-mdi-cog-outline' },
  { id: 'address', name: '收货地址', iconClass: 'i-mdi-map-marker-radius-outline' },
  { id: 'subscribe', name: '订阅消息', iconClass: 'i-mdi-plus-box-outline' },
  { id: 'service', name: '客服小蜜', iconClass: 'i-mdi-headset' },
]

const recommendItems: RecommendItem[] = [
  {
    id: 'rec-1',
    image: goodsImage,
    title: '进口冷冻带鱼段 1kg',
    price: 89,
  },
  {
    id: 'rec-2',
    image: goodsImage,
    title: '高筋小麦粉 10kg',
    price: 96,
  },
]

const statusBarHeightPx = ref(20)
const menuButtonTopPx = ref(65)

function resolveMetrics() {
  const systemInfo = wx.getWindowInfo?.() || wx.getSystemInfoSync()
  const menuButton = wx.getMenuButtonBoundingClientRect()
  statusBarHeightPx.value = systemInfo.statusBarHeight || 20
  menuButtonTopPx.value = menuButton.top || statusBarHeightPx.value + 45
}

onMounted(() => {
  resolveMetrics()
})
</script>

<template>
  <view class="user-page">
    <view class="user-page__bg">
      <view class="user-page__bg-glow user-page__bg-glow--left" />
      <view class="user-page__bg-glow user-page__bg-glow--right" />
    </view>

    <scroll-view scroll-y enhanced :show-scrollbar="false" class="user-page__scroll">
      <view class="user-page__content" :style="{ paddingTop: `${menuButtonTopPx + 45}px` }">
        <view class="user-page__profile-row">
          <image class="user-page__avatar" src="/logo.png" mode="aspectFill" />
          <view class="user-page__profile-main">
            <text class="user-page__name">达什拉克</text>
            <text class="user-page__member">会员名: 初秋_夏</text>
          </view>
        </view>

        <view class="vip-card">
          <view class="vip-card__head">
            <text class="vip-card__title">会员 开卡预计省1682/年</text>
            <view class="vip-card__coupon">
              领30元红包
            </view>
          </view>

          <view class="vip-card__benefits">
            <view class="vip-card__benefit-item">
              <text class="vip-card__benefit-title">生活特权</text>
              <text class="vip-card__benefit-sub">吃喝玩乐全都有</text>
              <view class="vip-card__logo-row">
                <view class="vip-card__logo vip-card__logo--blue">
                  T
                </view>
                <view class="vip-card__logo vip-card__logo--red">
                  T
                </view>
              </view>
              <view class="vip-card__free-row">
                <text>免费领</text>
                <text>免费领</text>
              </view>
            </view>

            <view class="vip-card__benefit-item vip-card__benefit-item--middle">
              <text class="vip-card__benefit-title">专属特权</text>
              <view class="vip-card__middle-icon">
                X
              </view>
            </view>

            <view class="vip-card__benefit-item vip-card__benefit-item--price">
              <text class="vip-card__benefit-title">会员日88折</text>
              <text class="vip-card__price">¥105.51</text>
              <text class="vip-card__old-price">¥119.9</text>
            </view>
          </view>
        </view>

        <view class="user-page__asset-row panel">
          <view class="user-page__asset-item">
            <text class="user-page__asset-label">红包卡券</text>
            <text class="user-page__asset-num">0</text>
            <text class="user-page__asset-label">张</text>
          </view>
          <view class="user-page__asset-divider" />
          <view class="user-page__asset-item">
            <text class="user-page__asset-label">我的钱包</text>
            <text class="user-page__asset-num">0</text>
            <text class="user-page__asset-label">元</text>
          </view>
        </view>

        <view class="panel user-page__order-panel">
          <view class="user-page__panel-title">
            我的订单
          </view>
          <view class="user-page__entry-grid user-page__entry-grid--order">
            <view v-for="item in orderEntries" :key="item.id" class="user-page__entry-item">
              <view :class="`${item.iconClass} user-page__entry-icon`" />
              <text class="user-page__entry-text">{{ item.name }}</text>
            </view>
          </view>

          <view class="user-page__entry-grid user-page__entry-grid--tool">
            <view v-for="item in toolEntries" :key="item.id" class="user-page__entry-item">
              <view :class="`${item.iconClass} user-page__entry-icon`" />
              <text class="user-page__entry-text">{{ item.name }}</text>
            </view>
          </view>
        </view>

        <view class="user-page__recommend-title-wrap">
          <view class="user-page__recommend-line" />
          <text class="user-page__recommend-title">推荐·RECOMMEND</text>
          <view class="user-page__recommend-line" />
        </view>

        <view class="user-page__recommend-grid">
          <view v-for="item in recommendItems" :key="item.id" class="user-page__recommend-item">
            <image class="user-page__recommend-image" :src="item.image" mode="aspectFill" />
            <text class="user-page__recommend-name">{{ item.title }}</text>
            <text class="user-page__recommend-price">¥{{ item.price }}</text>
          </view>
        </view>

        <view class="user-page__bottom-space" />
      </view>
    </scroll-view>

    <view class="user-page__settle-bar">
      <view class="user-page__settle-left">
        <view class="user-page__cart-icon-wrap">
          <view class="i-mdi-basket user-page__cart-icon" />
          <text class="user-page__cart-badge">4</text>
        </view>

        <view class="user-page__settle-price-wrap">
          <text class="user-page__settle-shop">云享仓</text>
          <text class="user-page__settle-price">¥2214.3</text>
          <text class="user-page__settle-detail">明细 ^</text>
        </view>
      </view>

      <view class="user-page__checkout-btn">
        去下单
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.user-page {
  @apply relative h-screen overflow-hidden bg-[#f3f4f6];
}

.user-page__bg {
  @apply pointer-events-none absolute left-0 right-0 top-0 h-[430rpx] overflow-hidden;

  background: linear-gradient(180deg, #d8eeff 0%, #eaf5ff 62%, #f3f4f6 100%);
}

.user-page__bg-glow {
  @apply absolute rounded-full;

  filter: blur(12rpx);
}

.user-page__bg-glow--left {
  @apply left-[-50rpx] top-[10rpx] h-[180rpx] w-[180rpx] bg-[rgba(67,180,255,0.26)];
}

.user-page__bg-glow--right {
  @apply right-[30rpx] top-[36rpx] h-[120rpx] w-[120rpx] bg-[rgba(150,214,255,0.32)];
}

.user-page__scroll {
  @apply relative z-[1] h-full;
}

.user-page__content {
  @apply px-[18rpx] pb-[40rpx];
}

.user-page__profile-row {
  @apply flex items-center;
}

.user-page__avatar {
  @apply h-[108rpx] w-[108rpx] rounded-full border-[4rpx] border-solid border-white bg-[#eef2f7];
}

.user-page__profile-main {
  @apply ml-[18rpx] min-w-0;
}

.user-page__name {
  @apply block text-[32rpx] font-bold text-[#1e2732];
}

.user-page__member {
  @apply mt-[8rpx] block text-[24rpx] text-[#6f7b89];
}

.vip-card {
  @apply mt-[18rpx] overflow-hidden rounded-[18rpx] bg-[#3c424f] p-[8rpx] shadow-[0_8rpx_24rpx_rgba(32,40,56,0.24)];
}

.vip-card__head {
  @apply flex items-center justify-between px-[8rpx] pb-[10rpx] pt-[4rpx];
}

.vip-card__title {
  @apply text-[24rpx] font-medium text-[#ffd995];
}

.vip-card__coupon {
  @apply rounded-[999rpx] bg-[#eec28e] px-[16rpx] py-[6rpx] text-[22rpx] font-medium text-[#5b3d18];
}

.vip-card__benefits {
  @apply grid grid-cols-3 gap-[8rpx];
}

.vip-card__benefit-item {
  @apply flex min-h-[182rpx] flex-col rounded-[12rpx] bg-white p-[10rpx];
}

.vip-card__benefit-title {
  @apply text-[34rpx] font-semibold text-[#222];
}

.vip-card__benefit-sub {
  @apply mt-[4rpx] text-[22rpx] text-[#5f6773];
}

.vip-card__logo-row {
  @apply mt-[10rpx] flex gap-[8rpx];
}

.vip-card__logo {
  @apply flex h-[62rpx] w-[62rpx] items-center justify-center rounded-[14rpx] text-[26rpx] font-bold text-white;
}

.vip-card__logo--blue {
  @apply bg-[#6ac9ff];
}

.vip-card__logo--red {
  @apply bg-[#eb1f2f];
}

.vip-card__free-row {
  @apply mt-auto flex justify-between text-[22rpx] text-[#666];
}

.vip-card__benefit-item--middle {
  @apply items-center justify-center;
}

.vip-card__middle-icon {
  @apply mt-[8rpx] flex h-[78rpx] w-[78rpx] items-center justify-center rounded-[20rpx] bg-[#f4e8de] text-[42rpx] text-[#d4a87a];
}

.vip-card__benefit-item--price {
  @apply justify-between;
}

.vip-card__price {
  @apply mt-[24rpx] text-[44rpx] font-semibold text-[#ff4f2f];
}

.vip-card__old-price {
  @apply text-[22rpx] text-[#9aa0aa] line-through;
}

.panel {
  @apply rounded-[18rpx] bg-[#efefef] px-[16rpx];
}

.user-page__asset-row {
  @apply mt-[14rpx] flex items-center justify-between py-[20rpx];
}

.user-page__asset-item {
  @apply flex flex-1 items-baseline justify-center;
}

.user-page__asset-label {
  @apply text-[30rpx] text-[#555f6d];
}

.user-page__asset-num {
  @apply mx-[6rpx] text-[44rpx] font-semibold leading-none text-[#242c38];
}

.user-page__asset-divider {
  @apply h-[38rpx] w-[1px] bg-[#d8d8d8];
}

.user-page__order-panel {
  @apply mt-[14rpx] py-[16rpx];
}

.user-page__panel-title {
  @apply text-[34rpx] font-semibold text-[#1f2937];
}

.user-page__entry-grid {
  @apply grid;
}

.user-page__entry-grid--order {
  @apply mt-[12rpx] grid-cols-5 gap-[8rpx];
}

.user-page__entry-grid--tool {
  @apply mt-[14rpx] grid-cols-4 gap-[8rpx] border-t border-[#dddddd] pt-[14rpx];
}

.user-page__entry-item {
  @apply flex flex-col items-center justify-center py-[8rpx];
}

.user-page__entry-icon {
  @apply text-[50rpx] text-[#68707a];
}

.user-page__entry-text {
  @apply mt-[8rpx] text-[24rpx] text-[#606874];
}

.user-page__recommend-title-wrap {
  @apply mt-[20rpx] flex items-center justify-center gap-[12rpx];
}

.user-page__recommend-line {
  @apply h-[1px] w-[44rpx] bg-[#d4d4d4];
}

.user-page__recommend-title {
  @apply text-[30rpx] font-semibold text-[#8d95a0];
}

.user-page__recommend-grid {
  @apply mt-[14rpx] grid grid-cols-2 gap-[14rpx];
}

.user-page__recommend-item {
  @apply rounded-[16rpx] bg-white p-[12rpx];
}

.user-page__recommend-image {
  @apply h-[188rpx] w-full rounded-[12rpx] bg-[#eef1f4];
}

.user-page__recommend-name {
  @apply mt-[8rpx] line-clamp-2 text-[24rpx] text-[#303846];
}

.user-page__recommend-price {
  @apply mt-[8rpx] block text-[34rpx] font-semibold text-[#ff5a36];
}

.user-page__bottom-space {
  @apply h-[220rpx];
}

.user-page__settle-bar {
  @apply fixed left-0 right-0 z-[90] flex items-center justify-between bg-white px-[18rpx] py-[12rpx] shadow-[0_-8rpx_24rpx_rgba(0,0,0,0.08)];

  bottom: calc(98rpx + env(safe-area-inset-bottom));
  bottom: calc(98rpx + constant(safe-area-inset-bottom));
}

.user-page__settle-left {
  @apply flex items-center;
}

.user-page__cart-icon-wrap {
  @apply relative mr-[12rpx] flex h-[64rpx] w-[64rpx] items-center justify-center rounded-full bg-[#47b3f8];
}

.user-page__cart-icon {
  @apply text-[36rpx] text-white;
}

.user-page__cart-badge {
  @apply absolute -right-[10rpx] -top-[10rpx] rounded-[999rpx] bg-[#ff5a36] px-[8rpx] py-[2rpx] text-[20rpx] text-white;
}

.user-page__settle-price-wrap {
  @apply flex items-baseline;
}

.user-page__settle-shop {
  @apply mr-[8rpx] text-[26rpx] text-[#3d8fca];
}

.user-page__settle-price {
  @apply text-[50rpx] font-semibold leading-none text-[#ff4f2f];
}

.user-page__settle-detail {
  @apply ml-[6rpx] text-[24rpx] text-[#ff4f2f];
}

.user-page__checkout-btn {
  @apply min-w-[188rpx] rounded-[999rpx] bg-[#2ea8ff] px-[24rpx] py-[14rpx] text-center text-[38rpx] font-medium text-white;
}
</style>
