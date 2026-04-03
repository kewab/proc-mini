<script setup lang="ts">
import type { HomeGoodsItem } from '@/mock/home'

interface Props {
  goods: HomeGoodsItem[]
  updatedAt?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  tapGoods: [item: HomeGoodsItem]
}>()

defineComponentJson({
  styleIsolation: 'apply-shared',
})

function formatPrice(value: number) {
  return value % 1 === 0 ? `${value}` : value.toFixed(1)
}
</script>

<template>
  <view class="home-goods">
    <view class="home-goods__header">
      <view class="home-goods__title-wrap">
        <view class="i-mdi-fire home-goods__title-icon" />
        <text class="home-goods__title">采购推荐</text>
      </view>
      <text class="home-goods__meta">{{ props.updatedAt }}</text>
    </view>

    <view class="home-goods__grid">
      <view v-for="item in props.goods" :key="item.id" class="home-goods__item" @tap="emit('tapGoods', item)">
        <image :src="item.image" mode="aspectFill" class="home-goods__image" />
        <view class="home-goods__body">
          <text class="home-goods__item-title">{{ item.title }}</text>
          <text class="home-goods__subtitle">{{ item.subtitle }}</text>
          <text class="home-goods__tag">
            <text class="i-mdi-package-variant-closed home-goods__tag-icon" />
            {{ item.stockText }}
          </text>
          <view class="home-goods__footer">
            <view class="home-goods__price-wrap">
              <text class="home-goods__price-mark">¥</text>
              <text class="home-goods__price">{{ formatPrice(item.price) }}</text>
              <text class="home-goods__origin">¥{{ formatPrice(item.originPrice) }}</text>
            </view>
            <view class="home-goods__cta">
              选购
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.home-goods {
  @apply px-[28rpx] pb-[20rpx] pt-[28rpx];
}

.home-goods__header {
  @apply mb-[18rpx] flex items-center justify-between;
}

.home-goods__title-wrap {
  @apply flex items-center;
}

.home-goods__title-icon {
  @apply mr-[8rpx] text-[30rpx] text-[#f25d34];
}

.home-goods__title {
  @apply text-[30rpx] font-semibold text-[#111827];
}

.home-goods__meta {
  @apply text-[21rpx] text-[#9ca3af];
}

.home-goods__grid {
  @apply flex flex-wrap justify-between gap-y-[20rpx];
}

.home-goods__item {
  @apply w-[calc(50%-10rpx)] overflow-hidden rounded-[24rpx] bg-white shadow-[0_12rpx_28rpx_rgba(15,23,42,0.08)];
}

.home-goods__image {
  @apply h-[230rpx] w-full;
}

.home-goods__body {
  @apply p-[16rpx];
}

.home-goods__item-title {
  @apply block truncate text-[26rpx] font-semibold text-[#111827];
}

.home-goods__subtitle {
  @apply mt-[8rpx] line-clamp-2 min-h-[64rpx] text-[22rpx] leading-[32rpx] text-[#6b7280];
}

.home-goods__tag {
  @apply mt-[10rpx] inline-flex items-center rounded-[999rpx] bg-[#fef3e7] px-[12rpx] py-[4rpx] text-[20rpx] text-[#d97706];
}

.home-goods__tag-icon {
  @apply mr-[4rpx] text-[20rpx];
}

.home-goods__footer {
  @apply mt-[14rpx] flex items-end justify-between;
}

.home-goods__price-wrap {
  @apply flex items-baseline;
}

.home-goods__price-mark {
  @apply text-[20rpx] font-semibold text-[#ef4444];
}

.home-goods__price {
  @apply text-[32rpx] font-semibold leading-none text-[#ef4444];
}

.home-goods__origin {
  @apply ml-[8rpx] text-[20rpx] text-[#9ca3af] line-through;
}

.home-goods__cta {
  @apply rounded-[999rpx] bg-[#f25d34] px-[18rpx] py-[8rpx] text-[22rpx] text-white;
}
</style>
