<script setup lang="ts">
import { createStore, onHide, onLaunch, onShow } from 'wevu'
import './assets/main.scss'

createStore()

defineAppJson({
  pages: [
    'pages/index/index',
    'pages/category/index',
    'pages/cart/index',
    'pages/user/index',
    'pages/order/confirm/index',
    'pages/test/index',
  ],
  window: {
    navigationBarTitleText: '采购小程序',
    navigationBarBackgroundColor: '#2f2b5f',
    navigationBarTextStyle: 'white',
    backgroundTextStyle: 'dark',
  },
  tabBar: {
    custom: true, // 关键：开启自定义
    color: '#7a7aa0',
    selectedColor: '#2f2b5f',
    backgroundColor: '#ffffff',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页',
      },
      {
        pagePath: 'pages/category/index',
        text: '分类',
      },
      {
        pagePath: 'pages/cart/index',
        text: '购物车',
      },
      {
        pagePath: 'pages/user/index',
        text: '我的',
      },
    ],
  },
  style: 'v2',
  componentFramework: 'glass-easel',
  sitemapLocation: 'sitemap.json',
})

onShow(() => {
  wx.getLogManager({ level: 1 }).info('[weapp-vite-wevu-template] app show')
})

onHide(() => {
  wx.getLogManager({ level: 1 }).info('[weapp-vite-wevu-template] app hide')
})

onLaunch(() => {
  wx.getLogManager({ level: 1 }).info('[weapp-vite-wevu-template] app launch')
})
</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>
