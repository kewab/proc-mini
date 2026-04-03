<script setup lang="ts">
import type { HomeActivityItem, HomeBannerItem, HomeNavItem } from '@/mock/home'

interface Props {
  activities: HomeActivityItem[]
  banners: HomeBannerItem[]
  navItems: HomeNavItem[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'banner-change': [item: HomeBannerItem]
  'tap-activity': [item: HomeActivityItem]
  'tap-nav': [item: HomeNavItem]
}>()

defineComponentJson({
  styleIsolation: 'apply-shared',
})

function handleSwiperChange(event: { detail?: { current?: number } }) {
  const current = Number(event?.detail?.current ?? 0)
  const item = props.banners[current]
  if (item) {
    emit('banner-change', item)
  }
}
</script>

<template>
  <view class="home-modules">
    <swiper
      class="home-modules__swiper"
      indicator-dots
      circular
      autoplay
      interval="3200"
      indicator-active-color="#ffffff"
      @change="handleSwiperChange"
    >
      <swiper-item v-for="item in props.banners" :key="item.id" class="home-modules__swiper-item">
        <image :src="item.image" mode="aspectFill" class="home-modules__swiper-image" />
        <view class="home-modules__swiper-mask">
          <text class="home-modules__swiper-title">{{ item.title }}</text>
        </view>
      </swiper-item>
    </swiper>

    <view class="home-modules__card home-modules__nav-grid">
      <view v-for="item in props.navItems" :key="item.id" class="home-modules__nav-item" @tap="emit('tap-nav', item)">
        <view class="home-modules__nav-badge">
          <image :src="item.image" mode="aspectFill" class="home-modules__nav-image" />
          <view :class="`${item.iconClass} home-modules__nav-icon`" />
        </view>
        <text class="home-modules__nav-title">{{ item.name }}</text>
        <text class="home-modules__nav-desc">{{ item.description }}</text>
      </view>
    </view>

    <view class="home-modules__activities">
      <view
        v-for="item in props.activities"
        :key="item.id"
        class="home-modules__card home-modules__activity-item"
        @tap="emit('tap-activity', item)"
      >
        <view class="home-modules__activity-copy">
          <text class="home-modules__activity-title">{{ item.title }}</text>
          <text class="home-modules__activity-subtitle">{{ item.subtitle }}</text>
          <text class="home-modules__activity-cta">
            {{ item.cta }}
            <text class="i-mdi-chevron-right home-modules__activity-arrow" />
          </text>
        </view>
        <image :src="item.image" mode="aspectFill" class="home-modules__activity-image" />
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.home-modules {
  @apply mt-[-4rpx] px-[28rpx];
}

.home-modules__card {
  @apply overflow-hidden rounded-[24rpx] bg-white shadow-[0_12rpx_36rpx_rgba(15,23,42,0.08)];
}

.home-modules__swiper {
  @apply h-[296rpx] overflow-hidden rounded-[24rpx];
}

.home-modules__swiper-item {
  @apply relative;
}

.home-modules__swiper-image {
  @apply h-full w-full;
}

.home-modules__swiper-mask {
  @apply absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[rgba(15,23,42,0.62)] to-transparent px-[20rpx] pb-[24rpx] pt-[48rpx];
}

.home-modules__swiper-title {
  @apply text-[28rpx] font-semibold text-white;
}

.home-modules__nav-grid {
  @apply mt-[24rpx] grid grid-cols-4 gap-[8rpx] p-[20rpx];
}

.home-modules__nav-item {
  @apply flex items-center justify-center px-[6rpx] py-[8rpx];
}

.home-modules__nav-badge {
  @apply relative;
}

.home-modules__nav-image {
  @apply h-[84rpx] w-[84rpx] rounded-full;
}

.home-modules__nav-icon {
  @apply absolute bottom-[-6rpx] right-[-6rpx] rounded-full bg-[#f25d34] p-[8rpx] text-[22rpx] text-white;
}

.home-modules__nav-title {
  @apply mt-[14rpx] text-[26rpx] font-semibold text-[#111827];
}

.home-modules__nav-desc {
  @apply mt-[6rpx] text-[20rpx] text-[#9ca3af];
}

.home-modules__activities {
  @apply mt-[24rpx] grid gap-[18rpx];
}

.home-modules__activity-item {
  @apply flex items-center justify-between px-[20rpx] py-[22rpx];
}

.home-modules__activity-copy {
  @apply flex min-w-0 flex-1 flex-col;
}

.home-modules__activity-title {
  @apply truncate text-[30rpx] font-semibold text-[#111827];
}

.home-modules__activity-subtitle {
  @apply mt-[8rpx] truncate text-[23rpx] text-[#6b7280];
}

.home-modules__activity-cta {
  @apply mt-[12rpx] inline-flex items-center text-[24rpx] font-medium text-[#f25d34];
}

.home-modules__activity-arrow {
  @apply ml-[4rpx] text-[24rpx];
}

.home-modules__activity-image {
  @apply ml-[18rpx] h-[104rpx] w-[104rpx] rounded-[18rpx];
}
</style>
