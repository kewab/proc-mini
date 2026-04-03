<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
}>(), {
  title: '',
})

defineComponentJson({
  styleIsolation: 'apply-shared',
})
</script>

<template>
  <view class="h-[44rpx]">
    顶部导航栏-{{ title }}
  </view>
</template>
