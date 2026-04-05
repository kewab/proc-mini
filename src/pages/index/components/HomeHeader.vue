<script setup lang="ts">
import { computed, onMounted, ref } from 'wevu'

interface Props {
  solidBackground?: boolean
  title: string
  subtitle: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  notice: []
  search: []
  toggleNetwork: []
}>()

defineComponentJson({
  styleIsolation: 'apply-shared',
})

const statusBarHeightPx = ref(20)
const menuButtonHeightPx = ref(32)
const topGapPx = ref(6)

const navHeightPx = computed(() => statusBarHeightPx.value + menuButtonHeightPx.value + topGapPx.value * 2)
const headerHeightPx = computed(() => navHeightPx.value + 24)

function resolveMetrics() {
  const systemInfo = wx.getWindowInfo?.() || wx.getSystemInfoSync()
  const menuButton = wx.getMenuButtonBoundingClientRect()

  statusBarHeightPx.value = systemInfo.statusBarHeight || 20
  menuButtonHeightPx.value = menuButton.height || 32
  topGapPx.value = Math.max(menuButton.top - statusBarHeightPx.value, 6)
}

onMounted(() => {
  resolveMetrics()
})
</script>

<template>
  <view :style="{ height: `${headerHeightPx}px` }" />

  <view
    class="home-header"
    :class="props.solidBackground ? 'home-header--solid' : ''"
  >
    <view class="home-header__top-shell" :style="{ paddingTop: `${statusBarHeightPx}px`, height: `${navHeightPx}px` }">
      <view class="home-header__top-inner">
        <view class="home-header__brand">
          <text class="home-header__title">{{ props.title }}</text>
        </view>
      </view>
    </view>

    <view class="home-header__content">
      <text class="home-header__subtitle">{{ props.subtitle }}</text>
      <view class="home-header__search" @tap="emit('search')">
        <view class="i-mdi-magnify home-header__search-icon" />
        <text class="home-header__search-text">搜索商品、供应商、合同</text>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.home-header {
  @apply fixed left-0 right-0 top-0 z-[90] overflow-hidden;
}

.home-header__top-shell {
  @apply relative z-[2] bg-transparent transition-colors duration-300;
}

.home-header__top-inner {
  @apply flex h-full items-center justify-between px-[28rpx];
}

.home-header__brand {
  @apply text-[34rpx] font-semibold leading-none text-white transition-colors duration-300;
}

.home-header__title {
  @apply tracking-[1rpx];
}

.home-header__actions {
  @apply flex items-center gap-[12rpx];
}

.home-header__icon-wrap {
  @apply flex h-[56rpx] w-[56rpx] items-center justify-center rounded-full bg-[rgba(255,255,255,0.2)] transition-colors duration-300;
}

.home-header__icon {
  @apply text-[32rpx] text-white transition-colors duration-300;
}

.home-header__content {
  @apply relative z-[2] px-[28rpx] pb-[20rpx];
}

.home-header__subtitle {
  @apply block text-[24rpx] text-[rgba(255,255,255,0.92)] transition-colors duration-300;
}

.home-header__search {
  @apply mt-[16rpx] flex h-[72rpx] items-center rounded-[999rpx] bg-[#F5F5F5] px-[24rpx] text-[#9ca3af];
}

.home-header__search-icon {
  @apply mr-[12rpx] text-[40rpx] text-[#6b7280];
}

.home-header__search-text {
  @apply text-[26rpx];
}

.home-header__meta {
  @apply mt-[14rpx] block text-[22rpx] text-[rgba(255,255,255,0.86)] transition-colors duration-300;
}

.home-header--solid {
  @apply shadow-[0_8rpx_24rpx_rgba(15,23,42,0.08)] bg-white;
}

.home-header--solid .home-header__brand {
  @apply text-[#111827];
}

.home-header--solid .home-header__icon-wrap {
  @apply bg-[#f3f4f6];
}

.home-header--solid .home-header__icon {
  @apply text-[#374151];
}

.home-header--solid .home-header__subtitle {
  @apply text-[#374151];
}

.home-header--solid .home-header__meta {
  @apply text-[#6b7280];
}
</style>
