<script setup lang="ts">
import { ref, watch } from 'wevu'
import { usePullDownRefresh } from '@/hooks/usePullDownRefresh'
import { useToast } from '@/hooks/useToast'
import { Login } from '@/services/main'

definePageJson({
  navigationBarTitleText: '首页',
  enablePullDownRefresh: true,
  backgroundColor: '#f6f7fb',
  navigationStyle: 'custom',
})

const { showToast } = useToast()

const lastUpdated = ref('刚刚')
const refreshSeed = ref(1)

watch(refreshSeed, () => {
  lastUpdated.value = `更新于 ${new Date().toLocaleTimeString()}`
})

function nextRefreshSeedValue() {
  return refreshSeed.value >= 9 ? 1 : refreshSeed.value + 1
}

function refreshDashboard() {
  refreshSeed.value = nextRefreshSeedValue()
  showToast('指标已刷新')
}

function login() {
  Login().then(() => {
    showToast('登录成功')
  }).catch((err) => {
    showToast(err, 'error')
  })
}

usePullDownRefresh(refreshDashboard)
</script>

<template>
  <view class="min-h-screen bg-[#f6f7fb] px-[28rpx] pb-[88rpx] pt-[32rpx] text-[#1c1c3c]">
    测试采购小程序
    <button @tap="login">
      点击
    </button>
  </view>
</template>
