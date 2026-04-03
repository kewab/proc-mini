<script setup lang="ts">
import { computed, onMounted, ref } from 'wevu'

const props = withDefaults(defineProps<{
  title?: string
  isBackgroundColor?: boolean
}>(), {
  title: '',
  isBackgroundColor: true,
})

const emit = defineEmits<{
  getNavHeight: [height: number]
}>()

defineComponentJson({
  styleIsolation: 'apply-shared',
})

interface NavActionItem {
  name: string
  pagePath: string
  switchTab?: boolean
}

const titleMap: Record<string, string> = {
  'pages/index/index': '首页',
  'pages/category/index': '分类',
  'pages/cart/index': '购物车',
  'pages/user/index': '我的',
  'pages/test/index': '测试',
}

const actionItems: NavActionItem[] = [
  { name: '首页', pagePath: '/pages/index/index', switchTab: true },
  { name: '购物车', pagePath: '/pages/cart/index', switchTab: true },
]

const currentRoute = ref('')
const homeTop = ref(0)
const navHeightPx = ref(96)
const statusBarHeightPx = ref(20)
const menuButtonHeightPx = ref(32)
const menuButtonWidthPx = ref(88)
const menuRightPx = ref(12)
const showActions = ref(false)

const navTitle = computed(() => {
  if (props.title) {
    return props.title
  }
  return titleMap[currentRoute.value] || ''
})

const hasBack = computed(() => getCurrentPages().length > 1)

function resolveMetrics() {
  const systemInfo = wx.getWindowInfo?.() || wx.getSystemInfoSync()
  const menuButton = wx.getMenuButtonBoundingClientRect()

  statusBarHeightPx.value = systemInfo.statusBarHeight || 20
  menuButtonHeightPx.value = menuButton.height || 32
  menuButtonWidthPx.value = menuButton.width || 88
  menuRightPx.value = Math.max(systemInfo.windowWidth - menuButton.right, 12)
  homeTop.value = menuButton.top
  navHeightPx.value = statusBarHeightPx.value + menuButtonHeightPx.value + (menuButton.top - statusBarHeightPx.value) * 2
}

function syncRoute() {
  const pages = getCurrentPages()
  const current = pages.at(-1)
  currentRoute.value = current?.route || ''
}

function goBackOrHome() {
  showActions.value = false
  if (hasBack.value) {
    wx.navigateBack()
    return
  }
  wx.switchTab({ url: '/pages/index/index' })
}

function toggleActions() {
  showActions.value = !showActions.value
}

function closeActions() {
  showActions.value = false
}

function linkPage(item: NavActionItem) {
  if (item.switchTab) {
    wx.switchTab({ url: item.pagePath })
  }
  else {
    wx.navigateTo({ url: item.pagePath })
  }
  showActions.value = false
}

onMounted(() => {
  resolveMetrics()
  syncRoute()
  emit('getNavHeight', navHeightPx.value)
})
</script>

<template>
  <view>
    <view :style="{ height: `${navHeightPx}px` }" />

    <view
      class="fixed left-0 right-0 top-0 z-[101]"
      :class="props.isBackgroundColor ? 'bg-transparent' : ''"
      :style="{ height: `${navHeightPx}px` }"
    >
      <view class="relative h-full w-full">
        <view
          id="home"
          class="fixed z-[103] flex items-center overflow-hidden rounded-[999rpx] border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.72)] text-[#111]"
          :style="{
            top: `${homeTop}px`,
            left: '14rpx',
            height: `${menuButtonHeightPx}px`,
            lineHeight: `${menuButtonHeightPx}px`,
            width: `${menuButtonWidthPx}px`,
          }"
        >
          <view class="flex flex-1 items-center justify-center text-[30rpx]" @tap="goBackOrHome">
            <view
              :class="hasBack ? 'i-mdi-chevron-left text-[48rpx]' : 'i-mdi-home-outline text-[40rpx]'"
            />
          </view>
          <view class="h-[60%] w-[1px] bg-[#eee]" />
          <view class="flex flex-1 items-center justify-center text-[30rpx]" @tap.stop="toggleActions">
            <view class="i-mdi-dots-horizontal text-[40rpx]" />
          </view>
        </view>

        <view
          class="fixed left-1/2 z-[102] max-w-[420rpx] -translate-x-1/2 truncate px-[16rpx] text-center text-[34rpx] font-semibold text-white"
          :style="{
            top: `${homeTop}px`,
            height: `${menuButtonHeightPx}px`,
            lineHeight: `${menuButtonHeightPx}px`,
            right: `${menuRightPx + menuButtonWidthPx + 16}px`,
            left: `${menuButtonWidthPx + 36}px`,
          }"
        >
          {{ navTitle }}
        </view>
      </view>
    </view>

    <view v-if="showActions" class="fixed inset-0 z-[104]" @tap="closeActions">
      <view
        class="fixed z-[105] w-[240rpx] overflow-hidden rounded-[14rpx] bg-white shadow-[0_0_16rpx_rgba(0,0,0,0.08)]"
        :style="{
          top: `${navHeightPx + 8}px`,
          left: '14rpx',
        }"
        @tap.stop
      >
        <view
          v-for="item in actionItems"
          :key="item.pagePath"
          class="h-[84rpx] border-b border-[#eeeeee] px-[20rpx] text-[28rpx] leading-[84rpx] text-[#333] last:border-b-0"
          @tap="linkPage(item)"
        >
          {{ item.name }}
        </view>
      </view>
    </view>
  </view>
</template>
