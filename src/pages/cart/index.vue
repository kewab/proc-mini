<script setup lang="ts">
import { computed, onMounted, ref } from 'wevu'
import goodsImage from '@/assets/images/home/goods-1.png'

definePageJson({
  navigationBarTitleText: '购物车',
  enablePullDownRefresh: true,
  backgroundColor: '#f6f7fb',
  navigationStyle: 'custom',
})

interface CartItem {
  id: string
  image: string
  name: string
  price: number
  quantity: number
  selected: boolean
  tag: string
  unit: string
}

interface RecommendItem {
  id: string
  image: string
  price: number
  subtitle: string
  title: string
}

const cartItems = ref<CartItem[]>([
  {
    id: 'beef-1',
    image: goodsImage,
    name: '进口牛肋肉1kg',
    price: 76.9,
    quantity: 25,
    selected: true,
    tag: '明日达',
    unit: '袋',
  },
  {
    id: 'beef-2',
    image: goodsImage,
    name: '金钱腱 1kg',
    price: 108,
    quantity: 1,
    selected: true,
    tag: '明日达',
    unit: '袋',
  },
  {
    id: 'beef-3',
    image: goodsImage,
    name: '进口原切谷饲牛腱1.2kg',
    price: 108,
    quantity: 1,
    selected: true,
    tag: '明日达',
    unit: '包',
  },
  {
    id: 'shrimp-1',
    image: goodsImage,
    name: '原装进口王牌盐冻虾 1.5kg (约60-75只)',
    price: 75.8,
    quantity: 1,
    selected: true,
    tag: '明日达',
    unit: '盒',
  },
])

const recommendItems: RecommendItem[] = [
  {
    id: 'rec-1',
    image: goodsImage,
    title: '非转基因一级压榨花生油 5L',
    subtitle: '家庭囤货',
    price: 139,
  },
  {
    id: 'rec-2',
    image: goodsImage,
    title: '进口海盐黄油 450g',
    subtitle: '推荐搭配',
    price: 39.9,
  },
]

const statusBarHeightPx = ref(20)
const menuButtonHeightPx = ref(32)
const navHeightPx = ref(65)

const selectedItems = computed(() => cartItems.value.filter(item => item.selected))
const selectedCount = computed(() => selectedItems.value.length)
const selectedAmount = computed(() => Number(selectedItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(1)))

const allSelected = computed(() => cartItems.value.length > 0 && selectedItems.value.length === cartItems.value.length)

function resolveNavMetrics() {
  const systemInfo = wx.getWindowInfo?.() || wx.getSystemInfoSync()
  const menuButton = wx.getMenuButtonBoundingClientRect()

  statusBarHeightPx.value = systemInfo.statusBarHeight || 20
  menuButtonHeightPx.value = menuButton.height || 32
  navHeightPx.value = statusBarHeightPx.value + menuButtonHeightPx.value + (menuButton.top - statusBarHeightPx.value) * 2 + 5
}

function formatPrice(value: number) {
  return Number.isInteger(value) ? `${value}` : value.toFixed(1)
}

function toggleItemSelected(id: string) {
  cartItems.value = cartItems.value.map(item => item.id === id ? { ...item, selected: !item.selected } : item)
}

function toggleSelectAll() {
  const nextSelected = !allSelected.value
  cartItems.value = cartItems.value.map(item => ({ ...item, selected: nextSelected }))
}

function deleteSelected() {
  const nextItems = cartItems.value.filter(item => !item.selected)
  if (nextItems.length === cartItems.value.length) {
    wx.showToast({ title: '请先选择商品', icon: 'none' })
    return
  }
  cartItems.value = nextItems
}

function changeQuantity(id: string, delta: number) {
  cartItems.value = cartItems.value.map((item) => {
    if (item.id !== id) {
      return item
    }
    const nextQuantity = Math.max(1, item.quantity + delta)
    return {
      ...item,
      quantity: nextQuantity,
    }
  })
}

function updateQuantityByInput(id: string, rawValue: string) {
  const digits = rawValue.replace(/\D/g, '')
  const nextQuantity = digits ? Math.max(1, Number.parseInt(digits, 10)) : 1

  cartItems.value = cartItems.value.map(item => item.id === id ? { ...item, quantity: nextQuantity } : item)
}

onMounted(() => {
  resolveNavMetrics()
})
</script>

<template>
  <view class="cart-page">
    <view class="cart-page__header flex flex-col items-center justify-center" :style="{ height: `${navHeightPx}px`, paddingTop: `${statusBarHeightPx}px` }">
      <view class="cart-page__title-row">
        <text class="cart-page__title">购物车</text>
      </view>
    </view>

    <scroll-view scroll-y enhanced :show-scrollbar="false" class="cart-page__scroll">
      <view class="px-[16rpx]">
        <view class="cart-page__list-card">
          <view class="cart-page__list-head">
            <view class="cart-page__store-tag-group">
              <text class="cart-page__store-tag cart-page__store-tag--vip">云享仓</text>
              <text class="cart-page__store-tag cart-page__store-tag--delivery">全国配</text>
            </view>
            <text class="cart-page__delete" @tap="deleteSelected">删除</text>
          </view>

          <view v-for="item in cartItems" :key="item.id" class="cart-page__item">
            <view
              class="cart-page__checkbox"
              :class="item.selected ? 'cart-page__checkbox--checked' : ''"
              @tap="toggleItemSelected(item.id)"
            >
              <view v-if="item.selected" class="i-mdi-check" />
            </view>

            <image class="cart-page__item-image" :src="item.image" mode="aspectFill" />

            <view class="cart-page__item-main">
              <text class="cart-page__item-title">{{ item.name }}</text>
              <text class="cart-page__item-tag">{{ item.tag }}</text>

              <view class="cart-page__item-bottom">
                <view class="cart-page__price-wrap">
                  <text class="cart-page__price">¥{{ formatPrice(item.price) }}</text>
                  <text class="cart-page__unit">/{{ item.unit }}</text>
                </view>

                <view class="cart-page__stepper">
                  <view class="cart-page__step-btn" @tap="changeQuantity(item.id, -1)">
                    -
                  </view>
                  <input
                    class="cart-page__step-input"
                    type="number"
                    :value="String(item.quantity)"
                    @input="updateQuantityByInput(item.id, $event.detail.value)"
                  >
                  <view class="cart-page__step-btn" @tap="changeQuantity(item.id, 1)">
                    +
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>

        <view class="cart-page__recommend-title-wrap">
          <view class="cart-page__recommend-line" />
          <text class="cart-page__recommend-title">推荐·RECOMMEND</text>
          <view class="cart-page__recommend-line" />
        </view>

        <view class="cart-page__recommend-grid">
          <view v-for="item in recommendItems" :key="item.id" class="cart-page__recommend-item">
            <image class="cart-page__recommend-image" :src="item.image" mode="aspectFill" />
            <text class="cart-page__recommend-item-title">{{ item.title }}</text>
            <text class="cart-page__recommend-item-subtitle">{{ item.subtitle }}</text>
            <text class="cart-page__recommend-item-price">¥{{ formatPrice(item.price) }}</text>
          </view>
        </view>
      </view>
    </scroll-view>

    <view class="cart-page__settle-bar">
      <view class="cart-page__settle-left" @tap="toggleSelectAll">
        <view
          class="cart-page__checkbox cart-page__checkbox--sm"
          :class="allSelected ? 'cart-page__checkbox--checked' : ''"
        >
          <view v-if="allSelected" class="i-mdi-check" />
        </view>
        <text class="cart-page__settle-label">全选</text>
      </view>

      <view class="cart-page__settle-center">
        <text class="cart-page__total-label">合计:</text>
        <text class="cart-page__total-price">¥{{ formatPrice(selectedAmount) }}</text>
      </view>

      <view class="cart-page__checkout-btn">
        去下单({{ selectedCount }})
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.cart-page {
  @apply flex h-screen flex-col bg-[#f5f5f5];
}

.cart-page__header {
  @apply relative bg-[#f5f5f5];
}

.cart-page__title-row {
  @apply flex items-center justify-center;
}

.cart-page__title {
  @apply text-[34rpx] font-semibold text-[#1f1f1f];
}

.cart-page__scroll {
  @apply min-h-0 flex-1 pb-[240rpx];
}

.cart-page__list-card {
  @apply overflow-hidden rounded-[20rpx] bg-white px-[20rpx] pb-[8rpx] pt-[8rpx];
}

.cart-page__list-head {
  @apply flex items-center justify-between pb-[8rpx] pt-[8rpx];
}

.cart-page__store-tag-group {
  @apply flex items-center gap-[8rpx];
}

.cart-page__store-tag {
  @apply rounded-[6rpx] px-[8rpx] py-[2rpx] text-[18rpx] leading-none;
}

.cart-page__store-tag--vip {
  @apply bg-[#f0ecff] text-[#58489d];
}

.cart-page__store-tag--delivery {
  @apply border border-[#2da8ff] bg-[#ebf8ff] text-[#2da8ff];
}

.cart-page__delete {
  @apply text-[26rpx] font-medium text-[#999];
}

.cart-page__item {
  @apply flex items-center gap-[12rpx] py-[14rpx];
}

.cart-page__checkbox {
  @apply flex h-[36rpx] w-[36rpx] shrink-0 items-center justify-center rounded-full border border-[#d7d7d7] text-[24rpx] text-white;
}

.cart-page__checkbox--sm {
  @apply h-[34rpx] w-[34rpx] text-[22rpx];
}

.cart-page__checkbox--checked {
  @apply border-[#2ea8ff] bg-[#2ea8ff];
}

.cart-page__item-image {
  @apply h-[140rpx] w-[140rpx] shrink-0 rounded-[16rpx] bg-[#f5f5f5];
}

.cart-page__item-main {
  @apply min-w-0 flex-1 pr-[12rpx];
}

.cart-page__item-title {
  @apply block truncate text-[30rpx] font-semibold text-[#333];
}

.cart-page__item-tag {
  @apply mt-[8rpx] inline-block rounded-[6rpx] border border-[#2ea8ff] px-[8rpx] py-[2rpx] text-[20rpx] text-[#2ea8ff];
}

.cart-page__item-bottom {
  @apply mt-[10rpx] flex items-end justify-between;
}

.cart-page__price-wrap {
  @apply flex items-end;
}

.cart-page__price {
  @apply text-[42rpx] font-semibold leading-none text-[#ff5a36];
}

.cart-page__unit {
  @apply ml-[4rpx] text-[22rpx] text-[#b8b8b8];
}

.cart-page__stepper {
  @apply flex h-[56rpx] items-center overflow-hidden rounded-[8rpx] border border-[#ececec] bg-white;
}

.cart-page__step-btn {
  @apply flex h-full w-[56rpx] items-center justify-center text-[30rpx] text-[#666];
}

.cart-page__step-input {
  @apply h-full w-[74rpx] border-x border-[#ececec] text-center text-[26rpx] text-[#333];
}

.cart-page__recommend-title-wrap {
  @apply mt-[18rpx] flex items-center justify-center gap-[12rpx];
}

.cart-page__recommend-line {
  @apply h-[1px] w-[48rpx] bg-[#d8d8d8];
}

.cart-page__recommend-title {
  @apply text-[26rpx] font-semibold text-[#8e959f];
}

.cart-page__recommend-grid {
  @apply mt-[16rpx] grid grid-cols-2 gap-[14rpx];
}

.cart-page__recommend-item {
  @apply rounded-[16rpx] bg-white p-[14rpx];
}

.cart-page__recommend-image {
  @apply h-[220rpx] w-full rounded-[12rpx] bg-[#f5f5f5];
}

.cart-page__recommend-item-title {
  @apply mt-[10rpx] line-clamp-2 text-[24rpx] font-medium text-[#2f2f2f];
}

.cart-page__recommend-item-subtitle {
  @apply mt-[4rpx] block text-[20rpx] text-[#a0a0a0];
}

.cart-page__recommend-item-price {
  @apply mt-[8rpx] block text-[30rpx] font-semibold text-[#ff5a36];
}

.cart-page__settle-bar {
  @apply fixed left-0 right-0 z-[90] flex items-center bg-white px-[18rpx] py-[16rpx] shadow-[0_-8rpx_24rpx_rgba(0,0,0,0.06)];

  bottom: calc(98rpx + env(safe-area-inset-bottom));
  bottom: calc(98rpx + constant(safe-area-inset-bottom));
}

.cart-page__settle-left {
  @apply mr-[14rpx] flex items-center;
}

.cart-page__settle-label {
  @apply ml-[8rpx] text-[28rpx] text-[#333];
}

.cart-page__settle-center {
  @apply flex flex-1 items-baseline;
}

.cart-page__total-label {
  @apply text-[30rpx] font-medium text-[#333];
}

.cart-page__total-price {
  @apply ml-[4rpx] text-[44rpx] font-semibold leading-none text-[#ff5a36];
}

.cart-page__checkout-btn {
  @apply min-w-[220rpx] rounded-[999rpx] bg-[#2ea8ff] px-[24rpx] py-[14rpx] text-center text-[34rpx] font-medium text-white;
}
</style>
