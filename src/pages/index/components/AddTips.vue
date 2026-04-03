<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'wevu'

interface Props {
  delay?: number
  storageKey: string
  text: string
}

const props = withDefaults(defineProps<Props>(), {
  delay: 1200,
})

const emit = defineEmits<{
  close: []
}>()

defineComponentJson({
  styleIsolation: 'apply-shared',
})

const visible = ref(false)
const boxTopPx = ref(0)
const containerMarginPx = ref(0)
const arrowMarginPx = ref(0)
const timer = ref<number>()

function closeTips() {
  if (!visible.value) {
    return
  }
  visible.value = false
  wx.setStorageSync(props.storageKey, '1')
  emit('close')
}

function init() {
  if (wx.getStorageSync(props.storageKey)) {
    return
  }
  const menuRect = wx.getMenuButtonBoundingClientRect()
  const systemInfo = wx.getWindowInfo?.() || wx.getSystemInfoSync()

  boxTopPx.value = menuRect.bottom + 6
  containerMarginPx.value = Math.max(systemInfo.windowWidth - menuRect.right, 12)
  arrowMarginPx.value = Math.max(menuRect.width * 0.68, 22)

  timer.value = setTimeout(() => {
    visible.value = true
  }, props.delay) as unknown as number
}

onMounted(() => {
  init()
})

onUnmounted(() => {
  if (timer.value) {
    clearTimeout(timer.value)
  }
})
</script>

<template>
  <view v-if="visible" class="add-tips" :style="{ top: `${boxTopPx}px` }">
    <view class="add-tips__arrow" :style="{ marginRight: `${arrowMarginPx}px` }" />
    <view class="add-tips__body" :style="{ marginRight: `${containerMarginPx}px` }">
      <text class="add-tips__text">{{ props.text }}</text>
      <view class="add-tips__close" @tap="closeTips">
        <view class="i-mdi-close add-tips__close-icon" />
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.add-tips {
  @apply fixed right-0 z-[99] flex w-[72%] flex-col items-end;
}

.add-tips__arrow {
  @apply mr-[24rpx] h-0 w-0 border-l-[12rpx] border-r-[12rpx] border-b-[14rpx] border-l-transparent border-r-transparent border-b-white;
}

.add-tips__body {
  @apply flex items-center rounded-[14rpx] bg-white px-[20rpx] py-[14rpx] shadow-[0_10rpx_24rpx_rgba(15,23,42,0.14)];
}

.add-tips__text {
  @apply flex-1 pr-[10rpx] text-[23rpx] leading-[34rpx] text-[#111827];
}

.add-tips__close {
  @apply flex h-[36rpx] w-[36rpx] items-center justify-center rounded-full bg-[#f3f4f6];
}

.add-tips__close-icon {
  @apply text-[24rpx] text-[#6b7280];
}
</style>
