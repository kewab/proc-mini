<script setup lang="ts">
import { computed, storeToRefs } from 'wevu'
import { useCartStore } from '@/stores/cart'

defineComponentJson({
  styleIsolation: 'apply-shared',
})

const cartStore = useCartStore()
const {
  cartItems,
  cartAmount,
  cartShippingFee,
  cartPayableAmount,
  detailMode,
  detailVisible,
  selectedAmount,
  selectedItems,
  selectedPayableAmount,
  selectedShippingFee,
} = storeToRefs(cartStore)

const detailTitle = computed(() => detailMode.value === 'selected' ? '已选商品明细' : '购物车明细')
const detailItems = computed(() => detailMode.value === 'selected' ? selectedItems.value : cartItems.value)
const detailSubtotal = computed(() => detailMode.value === 'selected' ? selectedAmount.value : cartAmount.value)
const detailShippingFee = computed(() => detailMode.value === 'selected' ? selectedShippingFee.value : cartShippingFee.value)
const detailPayableAmount = computed(() => detailMode.value === 'selected' ? selectedPayableAmount.value : cartPayableAmount.value)

function formatPrice(value: number) {
  return value % 1 === 0 ? `${value}` : value.toFixed(1)
}

function closeSheet() {
  cartStore.closeDetail()
}
</script>

<template>
  <view class="cart-detail-sheet" :class="detailVisible ? 'cart-detail-sheet--visible' : ''">
    <view class="cart-detail-sheet__mask" @tap="closeSheet" />

    <view class="cart-detail-sheet__panel">
      <view class="cart-detail-sheet__handle" />

      <view class="cart-detail-sheet__header">
        <text class="cart-detail-sheet__title">{{ detailTitle }}</text>
        <view class="cart-detail-sheet__close" @tap="closeSheet">
          <view class="i-mdi-close" />
        </view>
      </view>

      <scroll-view scroll-y enhanced :show-scrollbar="false" class="cart-detail-sheet__scroll">
        <view v-if="detailItems.length > 0" class="cart-detail-sheet__list">
          <view v-for="item in detailItems" :key="item.id" class="cart-detail-sheet__item">
            <image class="cart-detail-sheet__item-image" :src="item.image" mode="aspectFill" />

            <view class="cart-detail-sheet__item-main">
              <text class="cart-detail-sheet__item-name">{{ item.name }}</text>
              <text v-if="item.subtitle" class="cart-detail-sheet__item-subtitle">{{ item.subtitle }}</text>

              <view class="cart-detail-sheet__meta-row">
                <text class="cart-detail-sheet__item-tag">{{ item.tag }}</text>
                <text class="cart-detail-sheet__item-unit">{{ item.quantity }} x {{ item.unit }}</text>
              </view>
            </view>

            <view class="cart-detail-sheet__item-price-wrap">
              <text class="cart-detail-sheet__item-price">¥{{ formatPrice(item.price * item.quantity) }}</text>
              <text class="cart-detail-sheet__item-price-meta">¥{{ formatPrice(item.price) }}/{{ item.unit }}</text>
            </view>
          </view>
        </view>

        <view v-else class="cart-detail-sheet__empty">
          <view class="i-mdi-cart-off cart-detail-sheet__empty-icon" />
          <text class="cart-detail-sheet__empty-text">当前没有可展示的商品</text>
        </view>
      </scroll-view>

      <view class="cart-detail-sheet__footer">
        <view class="cart-detail-sheet__summary-row">
          <text>商品小计</text>
          <text>¥{{ formatPrice(detailSubtotal) }}</text>
        </view>
        <view class="cart-detail-sheet__summary-row">
          <text>预计邮费</text>
          <text>¥{{ formatPrice(detailShippingFee) }}</text>
        </view>
        <view class="cart-detail-sheet__summary-row cart-detail-sheet__summary-row--total">
          <text>应付合计</text>
          <text>¥{{ formatPrice(detailPayableAmount) }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.cart-detail-sheet {
  @apply pointer-events-none fixed inset-0 z-[120];
}

.cart-detail-sheet--visible {
  @apply pointer-events-auto;

  .cart-detail-sheet__mask {
    @apply opacity-100;
  }

  .cart-detail-sheet__panel {
    transform: translateY(0);
  }
}

.cart-detail-sheet__mask {
  @apply absolute inset-0 bg-[rgba(13,21,34,0.36)] opacity-0 transition-opacity duration-300;
}

.cart-detail-sheet__panel {
  @apply absolute bottom-0 left-0 right-0 rounded-t-[32rpx] bg-white px-[24rpx] pb-[calc(28rpx+env(safe-area-inset-bottom))] pt-[12rpx] transition-transform duration-300;

  max-height: 78vh;
  padding-bottom: calc(28rpx + constant(safe-area-inset-bottom));
  transform: translateY(100%);
}

.cart-detail-sheet__handle {
  @apply mx-auto h-[8rpx] w-[96rpx] rounded-[999rpx] bg-[#dde3eb];
}

.cart-detail-sheet__header {
  @apply mt-[18rpx] flex items-center justify-between;
}

.cart-detail-sheet__title {
  @apply text-[30rpx] font-semibold text-[#1f2937];
}

.cart-detail-sheet__close {
  @apply flex h-[52rpx] w-[52rpx] items-center justify-center rounded-full bg-[#f3f6f9] text-[28rpx] text-[#6b7280];
}

.cart-detail-sheet__scroll {
  @apply mt-[18rpx];

  max-height: 44vh;
}

.cart-detail-sheet__list {
  @apply flex flex-col gap-[18rpx];
}

.cart-detail-sheet__item {
  @apply flex items-center gap-[16rpx] rounded-[20rpx] bg-[#f7f9fc] px-[16rpx] py-[14rpx];
}

.cart-detail-sheet__item-image {
  @apply h-[112rpx] w-[112rpx] shrink-0 rounded-[16rpx] bg-[#eef2f7];
}

.cart-detail-sheet__item-main {
  @apply min-w-0 flex-1;
}

.cart-detail-sheet__item-name {
  @apply block truncate text-[28rpx] font-medium text-[#1f2937];
}

.cart-detail-sheet__item-subtitle {
  @apply mt-[6rpx] block truncate text-[22rpx] text-[#8b95a1];
}

.cart-detail-sheet__meta-row {
  @apply mt-[10rpx] flex items-center gap-[10rpx];
}

.cart-detail-sheet__item-tag {
  @apply rounded-[999rpx] border border-[#2ea8ff] px-[10rpx] py-[2rpx] text-[20rpx] text-[#2ea8ff];
}

.cart-detail-sheet__item-unit {
  @apply text-[22rpx] text-[#6b7280];
}

.cart-detail-sheet__item-price-wrap {
  @apply min-w-[152rpx] text-right;
}

.cart-detail-sheet__item-price {
  @apply block text-[30rpx] font-semibold text-[#ff5a36];
}

.cart-detail-sheet__item-price-meta {
  @apply mt-[6rpx] block text-[20rpx] text-[#9aa3af];
}

.cart-detail-sheet__empty {
  @apply flex flex-col items-center justify-center py-[80rpx] text-center;
}

.cart-detail-sheet__empty-icon {
  @apply text-[76rpx] text-[#cbd5e1];
}

.cart-detail-sheet__empty-text {
  @apply mt-[12rpx] text-[24rpx] text-[#94a3b8];
}

.cart-detail-sheet__footer {
  @apply mt-[20rpx] rounded-[24rpx] bg-[#f7f9fc] px-[18rpx] py-[16rpx];
}

.cart-detail-sheet__summary-row {
  @apply flex items-center justify-between py-[8rpx] text-[26rpx] text-[#4b5563];
}

.cart-detail-sheet__summary-row--total {
  @apply mt-[4rpx] border-t border-[#e5ebf2] pt-[16rpx] text-[30rpx] font-semibold text-[#111827];
}
</style>
