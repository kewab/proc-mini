<script setup lang="ts">
import { computed, storeToRefs } from 'wevu'
import Navbar from '@/components/application/navbar.vue'
import { useCartStore } from '@/stores/cart'

definePageMeta({
  layout: false,
})

definePageJson({
  navigationBarTitleText: '确认下单',
  backgroundColor: '#f6f7fb',
  navigationStyle: 'custom',
})

const cartStore = useCartStore()
const { selectedItems, selectedAmount, selectedPayableAmount, selectedProductCount, selectedShippingFee } = storeToRefs(cartStore)

const deliveryTip = computed(() => selectedAmount.value >= 199 ? '已享免邮，预计明日 18:00 前送达' : '满 199 元免邮，当前仍可再凑单')

function formatPrice(value: number) {
  return value % 1 === 0 ? `${value}` : value.toFixed(1)
}

function submitOrder() {
  if (selectedProductCount.value <= 0) {
    wx.showToast({ title: '暂无可下单商品', icon: 'none' })
    return
  }

  wx.showToast({ title: '订单已提交', icon: 'success' })
}

function backToCart() {
  wx.navigateBack({ delta: 1 })
}
</script>

<template>
  <view class="confirm-order-page">
    <Navbar title="确认下单" :is-background-color="false" />

    <scroll-view scroll-y enhanced :show-scrollbar="false" class="confirm-order-page__scroll">
      <view class="confirm-order-page__content">
        <view class="confirm-order-page__address-card">
          <view class="confirm-order-page__address-badge">
            收货信息
          </view>
          <text class="confirm-order-page__address-name">达什拉克 138****6623</text>
          <text class="confirm-order-page__address-detail">上海市浦东新区张江镇科苑路 88 号 A 座 6 层</text>
          <text class="confirm-order-page__address-tip">{{ deliveryTip }}</text>
        </view>

        <view v-if="selectedItems.length > 0" class="confirm-order-page__goods-card">
          <view class="confirm-order-page__section-head">
            <text class="confirm-order-page__section-title">云享仓</text>
            <text class="confirm-order-page__section-meta">共 {{ selectedProductCount }} 件</text>
          </view>

          <view v-for="item in selectedItems" :key="item.id" class="confirm-order-page__goods-item">
            <image class="confirm-order-page__goods-image" :src="item.image" mode="aspectFill" />
            <view class="confirm-order-page__goods-main">
              <text class="confirm-order-page__goods-name">{{ item.name }}</text>
              <text v-if="item.subtitle" class="confirm-order-page__goods-subtitle">{{ item.subtitle }}</text>
              <view class="confirm-order-page__goods-meta">
                <text class="confirm-order-page__goods-tag">{{ item.tag }}</text>
                <text class="confirm-order-page__goods-unit">{{ item.quantity }} x {{ item.unit }}</text>
              </view>
            </view>
            <view class="confirm-order-page__goods-price-wrap">
              <text class="confirm-order-page__goods-price">¥{{ formatPrice(item.price * item.quantity) }}</text>
              <text class="confirm-order-page__goods-price-meta">¥{{ formatPrice(item.price) }}/{{ item.unit }}</text>
            </view>
          </view>
        </view>

        <view v-else class="confirm-order-page__empty-card">
          <view class="i-mdi-clipboard-text-off-outline confirm-order-page__empty-icon" />
          <text class="confirm-order-page__empty-title">没有可确认的商品</text>
          <view class="confirm-order-page__empty-btn" @tap="backToCart">
            返回购物车
          </view>
        </view>

        <view class="confirm-order-page__summary-card">
          <view class="confirm-order-page__summary-row">
            <text>商品小计</text>
            <text>¥{{ formatPrice(selectedAmount) }}</text>
          </view>
          <view class="confirm-order-page__summary-row">
            <text>运费</text>
            <text>¥{{ formatPrice(selectedShippingFee) }}</text>
          </view>
          <view class="confirm-order-page__summary-row confirm-order-page__summary-row--total">
            <text>应付金额</text>
            <text>¥{{ formatPrice(selectedPayableAmount) }}</text>
          </view>
        </view>
      </view>
    </scroll-view>

    <view class="confirm-order-page__footer">
      <view class="confirm-order-page__footer-price-wrap">
        <text class="confirm-order-page__footer-label">实付款</text>
        <text class="confirm-order-page__footer-price">¥{{ formatPrice(selectedPayableAmount) }}</text>
      </view>
      <view class="confirm-order-page__submit-btn" :class="selectedProductCount > 0 ? '' : 'confirm-order-page__submit-btn--disabled'" @tap="submitOrder">
        提交订单
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.confirm-order-page {
  @apply flex h-screen flex-col bg-[#f6f7fb];
}

.confirm-order-page__scroll {
  @apply min-h-0 flex-1;
}

.confirm-order-page__content {
  @apply px-[20rpx] pb-[220rpx] pt-[20rpx];
}

.confirm-order-page__address-card,
.confirm-order-page__goods-card,
.confirm-order-page__summary-card,
.confirm-order-page__empty-card {
  @apply rounded-[24rpx] bg-white p-[20rpx] shadow-[0_12rpx_28rpx_rgba(15,23,42,0.06)];
}

.confirm-order-page__goods-card,
.confirm-order-page__summary-card,
.confirm-order-page__empty-card {
  @apply mt-[18rpx];
}

.confirm-order-page__address-badge {
  @apply inline-flex rounded-[999rpx] bg-[#e0f5ff] px-[14rpx] py-[6rpx] text-[22rpx] text-[#1788d6];
}

.confirm-order-page__address-name {
  @apply mt-[14rpx] block text-[32rpx] font-semibold text-[#1f2937];
}

.confirm-order-page__address-detail {
  @apply mt-[10rpx] block text-[26rpx] leading-[40rpx] text-[#4b5563];
}

.confirm-order-page__address-tip {
  @apply mt-[12rpx] block text-[22rpx] text-[#f25d34];
}

.confirm-order-page__section-head {
  @apply flex items-center justify-between pb-[12rpx];
}

.confirm-order-page__section-title {
  @apply text-[30rpx] font-semibold text-[#1f2937];
}

.confirm-order-page__section-meta {
  @apply text-[24rpx] text-[#94a3b8];
}

.confirm-order-page__goods-item {
  @apply flex items-center gap-[16rpx] border-t border-[#edf2f7] py-[16rpx] first:border-t-0 first:pt-0 last:pb-0;
}

.confirm-order-page__goods-image {
  @apply h-[116rpx] w-[116rpx] shrink-0 rounded-[18rpx] bg-[#eef2f7];
}

.confirm-order-page__goods-main {
  @apply min-w-0 flex-1;
}

.confirm-order-page__goods-name {
  @apply block truncate text-[28rpx] font-medium text-[#1f2937];
}

.confirm-order-page__goods-subtitle {
  @apply mt-[6rpx] block truncate text-[22rpx] text-[#8b95a1];
}

.confirm-order-page__goods-meta {
  @apply mt-[10rpx] flex items-center gap-[10rpx];
}

.confirm-order-page__goods-tag {
  @apply rounded-[999rpx] border border-[#2ea8ff] px-[10rpx] py-[2rpx] text-[20rpx] text-[#2ea8ff];
}

.confirm-order-page__goods-unit {
  @apply text-[22rpx] text-[#64748b];
}

.confirm-order-page__goods-price-wrap {
  @apply min-w-[152rpx] text-right;
}

.confirm-order-page__goods-price {
  @apply block text-[30rpx] font-semibold text-[#ff5a36];
}

.confirm-order-page__goods-price-meta {
  @apply mt-[6rpx] block text-[20rpx] text-[#94a3b8];
}

.confirm-order-page__summary-row {
  @apply flex items-center justify-between py-[10rpx] text-[26rpx] text-[#475569];
}

.confirm-order-page__summary-row--total {
  @apply mt-[4rpx] border-t border-[#edf2f7] pt-[16rpx] text-[30rpx] font-semibold text-[#0f172a];
}

.confirm-order-page__empty-card {
  @apply flex flex-col items-center text-center;
}

.confirm-order-page__empty-icon {
  @apply text-[80rpx] text-[#cbd5e1];
}

.confirm-order-page__empty-title {
  @apply mt-[14rpx] text-[28rpx] font-semibold text-[#334155];
}

.confirm-order-page__empty-btn {
  @apply mt-[20rpx] rounded-[999rpx] bg-[#2ea8ff] px-[28rpx] py-[14rpx] text-[26rpx] font-medium text-white;
}

.confirm-order-page__footer {
  @apply fixed bottom-0 left-0 right-0 z-[20] flex items-center justify-between bg-white px-[20rpx] py-[16rpx] shadow-[0_-8rpx_24rpx_rgba(15,23,42,0.06)];

  padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
  padding-bottom: calc(16rpx + constant(safe-area-inset-bottom));
}

.confirm-order-page__footer-price-wrap {
  @apply flex items-baseline;
}

.confirm-order-page__footer-label {
  @apply text-[26rpx] text-[#334155];
}

.confirm-order-page__footer-price {
  @apply ml-[8rpx] text-[42rpx] font-semibold leading-none text-[#ff5a36];
}

.confirm-order-page__submit-btn {
  @apply min-w-[220rpx] rounded-[999rpx] bg-[#2ea8ff] px-[26rpx] py-[14rpx] text-center text-[30rpx] font-medium text-white;
}

.confirm-order-page__submit-btn--disabled {
  @apply bg-[#bfdbfe];
}
</style>
