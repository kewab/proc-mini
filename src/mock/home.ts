import activityGroup from '@/assets/images/home/activity-group.png'
import banner1 from '@/assets/images/home/banner-1.jpg'
import banner2 from '@/assets/images/home/banner-2.jpg'
import goods1 from '@/assets/images/home/goods-1.png'
import navContract from '@/assets/images/home/nav-contract.png'
import navProcure from '@/assets/images/home/nav-procure.png'
import navReport from '@/assets/images/home/nav-report.png'
import navStock from '@/assets/images/home/nav-stock.png'

export interface HomeBannerItem {
  id: string
  image: string
  title: string
}

export interface HomeNavItem {
  description: string
  iconClass: string
  id: string
  image: string
  name: string
}

export interface HomeActivityItem {
  cta: string
  id: string
  image: string
  subtitle: string
  title: string
}

export interface HomeGoodsItem {
  id: string
  image: string
  originPrice: number
  price: number
  stockText: string
  subtitle: string
  title: string
}

export interface HomeTipsConfig {
  storageKey: string
  text: string
}

export interface HomePageMockData {
  activities: HomeActivityItem[]
  banners: HomeBannerItem[]
  goods: HomeGoodsItem[]
  navItems: HomeNavItem[]
  tips: HomeTipsConfig
}

const baseData: HomePageMockData = {
  banners: [
    { id: 'banner-1', image: banner1, title: '春季采购补贴专场' },
    { id: 'banner-2', image: banner2, title: '企业常用耗材限时直降' },
  ],
  navItems: [
    {
      id: 'procure',
      name: '采购单',
      description: '快速提单',
      image: navProcure,
      iconClass: 'i-mdi-clipboard-text-outline',
    },
    {
      id: 'contract',
      name: '合同中心',
      description: '在线签署',
      image: navContract,
      iconClass: 'i-mdi-file-sign',
    },
    {
      id: 'stock',
      name: '库存看板',
      description: '动态预警',
      image: navStock,
      iconClass: 'i-mdi-warehouse',
    },
    {
      id: 'report',
      name: '采购报表',
      description: '经营分析',
      image: navReport,
      iconClass: 'i-mdi-chart-line',
    },
  ],
  activities: [
    {
      id: 'activity-group',
      title: '今日拼单专区',
      subtitle: '办公室常用物资 2 件起拼',
      cta: '立即查看',
      image: activityGroup,
    },
    {
      id: 'activity-coupon',
      title: '新人领券礼包',
      subtitle: '最高可减 120 元',
      cta: '去领取',
      image: activityGroup,
    },
  ],
  goods: [
    {
      id: 'goods-1',
      title: 'A4 复印纸 70g',
      subtitle: '500 张/包 · 8 包整箱',
      price: 139,
      originPrice: 169,
      stockText: '库存充足',
      image: goods1,
    },
    {
      id: 'goods-2',
      title: '中性笔黑色 0.5mm',
      subtitle: '12 支/盒 · 顺滑书写',
      price: 21.9,
      originPrice: 29.9,
      stockText: '近 24h 热销',
      image: goods1,
    },
    {
      id: 'goods-3',
      title: '加厚垃圾袋 45*55cm',
      subtitle: '100 只/卷 · 5 卷装',
      price: 36.8,
      originPrice: 45,
      stockText: '仓库直发',
      image: goods1,
    },
    {
      id: 'goods-4',
      title: '便签纸套装',
      subtitle: '多色分类 · 便捷标记',
      price: 19.9,
      originPrice: 25.9,
      stockText: '企业推荐',
      image: goods1,
    },
  ],
  tips: {
    text: '点击添加到我的小程序，微信首页下拉即可访问采购平台。',
    storageKey: 'proc-mini_home_add_tips_closed',
  },
}

function rotateList<T>(items: T[], seed: number): T[] {
  if (!items.length) {
    return []
  }
  const offset = ((seed % items.length) + items.length) % items.length
  return [...items.slice(offset), ...items.slice(0, offset)]
}

export function createHomePageMockData(seed = 0): HomePageMockData {
  return {
    ...baseData,
    banners: rotateList(baseData.banners, seed),
    navItems: [...baseData.navItems],
    activities: rotateList(baseData.activities, seed),
    goods: rotateList(baseData.goods, seed),
    tips: { ...baseData.tips },
  }
}
