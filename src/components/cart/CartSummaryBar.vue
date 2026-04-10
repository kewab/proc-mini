<script setup lang="ts">
import { computed, getCurrentInstance, nextTick, onMounted, onUnmounted, ref, storeToRefs, watch } from 'wevu'
import { showToast } from '@/hooks/useToast'
import { useCartStore } from '@/stores/cart'

defineComponentJson({
  styleIsolation: 'apply-shared',
})

const cartStore = useCartStore()
const { cartItemCount, cartPayableAmount, flyRequest, flyRequestKey } = storeToRefs(cartStore)

const instance = getCurrentInstance()
const iconRect = ref<WechatMiniprogram.BoundingClientRectCallbackResult | null>(null)
const ballVisible = ref(false)
const ballStartX = ref(0)
const ballStartY = ref(0)
const ballTranslateX = ref(0)
const ballTranslateY = ref(0)
const ballScale = ref(1)
let measureTimer: ReturnType<typeof setTimeout> | null = null
let hideBallTimer: ReturnType<typeof setTimeout> | null = null

function formatPrice(value: number) {
  return value % 1 === 0 ? `${value}` : value.toFixed(1)
}

const displayPrice = computed(() => formatPrice(cartPayableAmount.value))
const detailLabel = computed(() => cartItemCount.value > 0 ? '明细' : '购物车为空')

function measureIconRect() {
  const query = wx.createSelectorQuery()
  if (instance) {
    query.in(instance as any)
  }

  query.select('#cart-summary-icon').boundingClientRect((rect) => {
    if (rect) {
      iconRect.value = rect
      return
    }

    const windowInfo = wx.getWindowInfo?.() || wx.getSystemInfoSync()
    const rpx = windowInfo.windowWidth / 750
    iconRect.value = {
      left: 36 * rpx,
      top: windowInfo.windowHeight - (206 * rpx),
      width: 76 * rpx,
      height: 76 * rpx,
      right: 112 * rpx,
      bottom: windowInfo.windowHeight - (130 * rpx),
    } as WechatMiniprogram.BoundingClientRectCallbackResult
  }).exec()
}

function navigateToCart() {
  wx.switchTab({ url: '/pages/cart/index' })
}

function openDetail() {
  if (cartItemCount.value <= 0) {
    showToast('购物车还是空的', 'default')
    return
  }

  cartStore.openDetail('all')
}

function goCheckout() {
  if (cartItemCount.value <= 0) {
    showToast('请先添加商品', 'default')
    return
  }

  wx.navigateTo({ url: '/pages/order/confirm/index' })
}

function resetBallAnimation() {
  if (hideBallTimer) {
    clearTimeout(hideBallTimer)
    hideBallTimer = null
  }

  ballVisible.value = false
  ballScale.value = 1
  ballTranslateX.value = 0
  ballTranslateY.value = 0
}

function playFlyAnimation(startX: number, startY: number) {
  const rect = iconRect.value
  if (!rect) {
    return
  }

  resetBallAnimation()
  ballStartX.value = startX
  ballStartY.value = startY
  ballVisible.value = true

  nextTick(() => {
    ballTranslateX.value = rect.left + rect.width / 2 - startX
    ballTranslateY.value = rect.top + rect.height / 2 - startY
    ballScale.value = 0.45
  })

  hideBallTimer = setTimeout(() => {
    resetBallAnimation()
  }, 620)
}

onMounted(() => {
  nextTick(() => {
    measureIconRect()
  })

  measureTimer = setInterval(() => {
    measureIconRect()
  }, 1200)
})

onUnmounted(() => {
  if (measureTimer) {
    clearInterval(measureTimer)
    measureTimer = null
  }
  if (hideBallTimer) {
    clearTimeout(hideBallTimer)
    hideBallTimer = null
  }
})

watch(flyRequestKey, () => {
  if (!flyRequest.value) {
    return
  }
  playFlyAnimation(flyRequest.value.startX, flyRequest.value.startY)
})
</script>

<template>
  <view class="cart-summary-bar">
    <view class="cart-summary-bar__content">
      <view class="cart-summary-bar__left" @tap="navigateToCart">
        <view id="cart-summary-icon" class="cart-summary-bar__icon-wrap">
          <view class="i-mdi-basket cart-summary-bar__icon" />
          <text v-if="cartItemCount > 0" class="cart-summary-bar__badge">{{ cartItemCount }}</text>
        </view>

        <view class="cart-summary-bar__info">
          <text class="cart-summary-bar__shop">云享仓</text>
          <text v-if="cartItemCount > 0" class="cart-summary-bar__price">¥{{ displayPrice }}</text>
          <text v-else class="cart-summary-bar__empty">购物车还是空的，去加购</text>
        </view>
      </view>

      <view class="cart-summary-bar__right">
        <text class="cart-summary-bar__detail" @tap="openDetail">{{ detailLabel }}</text>
        <view class="cart-summary-bar__cta" :class="cartItemCount > 0 ? '' : 'cart-summary-bar__cta--disabled'" @tap="goCheckout">
          去下单
        </view>
      </view>
    </view>

    <view
      v-if="ballVisible"
      class="cart-summary-bar__ball-track"
      :style="{
        left: `${ballStartX}px`,
        top: `${ballStartY}px`,
        transform: `translate3d(${ballTranslateX}px, 0, 0)`,
      }"
    >
      <view
        class="cart-summary-bar__ball"
        :style="{
          transform: `translate3d(0, ${ballTranslateY}px, 0) scale(${ballScale})`,
        }"
      />
    </view>
  </view>
</template>

<style scoped lang="scss">
.cart-summary-bar {
  @apply fixed left-[20rpx] right-[20rpx] z-[90];

  bottom: calc(112rpx + env(safe-area-inset-bottom));
  bottom: calc(112rpx + constant(safe-area-inset-bottom));
}

.cart-summary-bar__content {
  @apply flex items-center justify-between rounded-[999rpx] bg-white px-[16rpx] py-[12rpx] shadow-[0_-8rpx_30rpx_rgba(31,45,61,0.12)];
}

.cart-summary-bar__left {
  @apply flex min-w-0 flex-1 items-center;
}

.cart-summary-bar__icon-wrap {
  @apply relative mr-[14rpx] flex h-[76rpx] w-[76rpx] shrink-0 items-center justify-center rounded-full bg-[#e0f5ff];
}

.cart-summary-bar__icon {
  @apply text-[40rpx] text-[#13a0ef];
}

.cart-summary-bar__badge {
  @apply absolute -right-[10rpx] -top-[8rpx] rounded-[999rpx] bg-[#ff5a36] px-[8rpx] py-[2rpx] text-[20rpx] font-semibold leading-none text-white;
}

.cart-summary-bar__info {
  @apply flex min-w-0 flex-col;
}

.cart-summary-bar__shop {
  @apply text-[22rpx] text-[#3d8fca];
}

.cart-summary-bar__price {
  @apply mt-[2rpx] text-[40rpx] font-semibold leading-none text-[#ff4f2f];
}

.cart-summary-bar__empty {
  @apply mt-[2rpx] text-[24rpx] text-[#6b7280];
}

.cart-summary-bar__right {
  @apply ml-[16rpx] flex shrink-0 items-center gap-[16rpx];
}

.cart-summary-bar__detail {
  @apply text-[24rpx] text-[#ff4f2f];
}

.cart-summary-bar__cta {
  @apply min-w-[188rpx] rounded-[999rpx] bg-[#2ea8ff] px-[24rpx] py-[14rpx] text-center text-[30rpx] font-medium text-white;
}

.cart-summary-bar__cta--disabled {
  @apply bg-[#bfdbfe] text-white;
}

.cart-summary-bar__ball-track {
  @apply pointer-events-none fixed z-[121] transition-transform duration-[560ms];

  transition-timing-function: linear;
}

.cart-summary-bar__ball {
  @apply h-[20rpx] w-[20rpx] rounded-full bg-[#ff3b30] shadow-[0_6rpx_12rpx_rgba(255,59,48,0.3)] transition-transform duration-[560ms];

  transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
}
</style>
