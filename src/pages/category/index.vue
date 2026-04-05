<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'wevu'
import goodsImage from '@/assets/images/home/goods-1.png'

interface ProductItem {
  badges: string[]
  featureText: string
  id: string
  memberPrice: number
  name: string
  origin?: string
  price: number
  sales: number
  tags: string[]
}

interface SubCategory {
  bannerSubtitle: string
  bannerTitle: string
  id: string
  name: string
  products: ProductItem[]
  tags: string[]
}

interface CategoryItem {
  iconClass: string
  id: string
  name: string
  subCategories: SubCategory[]
}

const hotWords = ['鸡爪', '牛排', '三文鱼', '黄油', '吐司']
const hotWordIndex = ref(0)
const hotWordDirection = ref(1)
let hotWordTimer: ReturnType<typeof setInterval> | null = null

const statusBarHeightPx = ref(20)
const menuButtonHeightPx = ref(32)
const menuButtonWidthPx = ref(88)

function buildProducts(subCategoryId: string, subCategoryName: string, seed: number): ProductItem[] {
  const names = ['进口原切牛肋肉1kg', '谷饲牛腱1.2kg', '金钱腱 1kg', '雪花牛排 500g', '手打牛肉丸 400g']

  return names.map((name, index) => {
    const price = Number((68 + seed * 6 + index * 12.5).toFixed(1))
    return {
      id: `${subCategoryId}-${index + 1}`,
      name: subCategoryName === '牛肉' ? name : `${subCategoryName}${name.replace('牛', '')}`,
      tags: index % 2 === 0 ? ['冷冻'] : ['冷藏'],
      origin: index % 2 === 0 ? '进口原切' : '精选分割',
      featureText: `月回头客${2200 + seed * 500 + index * 700}+人`,
      price,
      memberPrice: Number((price * 0.88).toFixed(1)),
      sales: 12000 - index * 1300 + seed * 420,
      badges: index === 0 ? ['明日达'] : ['次日达'],
    }
  })
}

const categoryList: CategoryItem[] = [
  {
    id: 'fruit',
    name: '果蔬鲜花',
    iconClass: 'i-mdi-food-apple-outline',
    subCategories: [
      {
        id: 'fresh-fruit',
        name: '新鲜水果',
        bannerTitle: '精选当季水果',
        bannerSubtitle: '产地直采 新鲜直达',
        tags: ['柑橘', '莓果', '苹果', '热带水果', '果切拼盘', '礼盒装'],
        products: buildProducts('fresh-fruit', '水果', 1),
      },
      {
        id: 'leafy',
        name: '叶菜根茎',
        bannerTitle: '绿叶菜专区',
        bannerSubtitle: '每日新到 轻松备餐',
        tags: ['生菜', '菠菜', '油麦菜', '土豆', '胡萝卜', '净菜包'],
        products: buildProducts('leafy', '蔬菜', 2),
      },
      {
        id: 'flower',
        name: '鲜花绿植',
        bannerTitle: '办公室花植',
        bannerSubtitle: '企业日常摆台推荐',
        tags: ['桌面花束', '绿萝', '多肉', '礼赠花束'],
        products: buildProducts('flower', '鲜花', 3),
      },
    ],
  },
  {
    id: 'meat',
    name: '肉禽蛋品',
    iconClass: 'i-mdi-food-steak',
    subCategories: [
      {
        id: 'hot-sale',
        name: '热卖推荐',
        bannerTitle: '品质牛排',
        bannerSubtitle: '味蕾盛宴 舌尖绽放',
        tags: ['牛肉', '牛排', '羊肉', '禽肉', '烧烤', '牛杂', '调理牛肉'],
        products: [
          {
            id: 'beef-1',
            name: '进口牛肋肉1kg',
            tags: ['冷冻'],
            origin: '进口原切 | 去骨带筋',
            featureText: '月回头客2000+人',
            price: 76.9,
            memberPrice: 67.8,
            sales: 19876,
            badges: ['明日达'],
          },
          {
            id: 'beef-2',
            name: '进口原切谷饲牛腱1.2kg',
            tags: ['冷冻'],
            origin: '谷饲慢养 | 纹理清晰',
            featureText: '月8000+人已下单',
            price: 108,
            memberPrice: 95,
            sales: 18210,
            badges: ['明日达'],
          },
          {
            id: 'beef-3',
            name: '金钱腱 1kg',
            tags: ['冷冻'],
            origin: '牛腱腱芯 | 适合酱卤',
            featureText: '月4000+人已下单',
            price: 108,
            memberPrice: 95,
            sales: 16700,
            badges: ['明日达'],
          },
          {
            id: 'beef-4',
            name: '原切菲力牛排 250g*4',
            tags: ['冷冻'],
            origin: '嫩度高 | 西餐推荐',
            featureText: '月3000+人复购',
            price: 126,
            memberPrice: 112.5,
            sales: 15880,
            badges: ['次日达'],
          },
        ],
      },
      {
        id: 'beef',
        name: '牛肉',
        bannerTitle: '进口牛肉专区',
        bannerSubtitle: '企业食堂团采爆款',
        tags: ['牛腩', '牛腱', '牛排', '牛杂', '牛肉卷', '牛肉粒'],
        products: buildProducts('beef', '牛肉', 2),
      },
      {
        id: 'mutton',
        name: '羊肉',
        bannerTitle: '高原羊肉',
        bannerSubtitle: '鲜嫩少膻 放心采购',
        tags: ['羊排', '羊蝎子', '羊肉卷', '羊腿肉', '羊杂'],
        products: buildProducts('mutton', '羊肉', 3),
      },
      {
        id: 'pork',
        name: '猪肉',
        bannerTitle: '优选猪肉',
        bannerSubtitle: '家常食材 一站购齐',
        tags: ['五花', '里脊', '排骨', '梅花肉', '猪蹄', '猪肘'],
        products: buildProducts('pork', '猪肉', 4),
      },
      {
        id: 'chicken',
        name: '鸡鸭鸽',
        bannerTitle: '禽类专区',
        bannerSubtitle: '宴请备货常备选择',
        tags: ['鸡胸', '鸡腿', '鸡翅', '鸭肉', '乳鸽'],
        products: buildProducts('chicken', '鸡肉', 5),
      },
      {
        id: 'semi',
        name: '腌腊/半成品',
        bannerTitle: '半成品专区',
        bannerSubtitle: '省时省力 出餐更快',
        tags: ['腊肠', '酱牛肉', '预制菜', '卤味拼盘'],
        products: buildProducts('semi', '半成品', 6),
      },
    ],
  },
  {
    id: 'seafood',
    name: '海鲜水产',
    iconClass: 'i-mdi-fish',
    subCategories: [
      {
        id: 'shrimp',
        name: '虾类',
        bannerTitle: '深海鲜虾',
        bannerSubtitle: '急冻锁鲜 鲜味十足',
        tags: ['白虾', '青虾', '虾仁', '熟虾', '礼盒虾'],
        products: buildProducts('shrimp', '鲜虾', 4),
      },
      {
        id: 'fish',
        name: '鱼类',
        bannerTitle: '鲜鱼专区',
        bannerSubtitle: '片鱼整鱼任你选',
        tags: ['鳕鱼', '巴沙鱼', '三文鱼', '黄花鱼'],
        products: buildProducts('fish', '鲜鱼', 5),
      },
    ],
  },
  {
    id: 'dairy',
    name: '乳品烘焙',
    iconClass: 'i-mdi-cupcake',
    subCategories: [
      {
        id: 'milk',
        name: '牛奶乳饮',
        bannerTitle: '奶品专区',
        bannerSubtitle: '早餐搭配常备',
        tags: ['纯牛奶', '酸奶', '奶酪', '黄油', '奶油'],
        products: buildProducts('milk', '乳品', 3),
      },
    ],
  },
  {
    id: 'grain',
    name: '粮油面点',
    iconClass: 'i-mdi-noodles',
    subCategories: [
      {
        id: 'rice',
        name: '米面粮油',
        bannerTitle: '主食专区',
        bannerSubtitle: '家庭囤货优选',
        tags: ['大米', '面粉', '挂面', '食用油', '杂粮'],
        products: buildProducts('rice', '主食', 2),
      },
    ],
  },
  {
    id: 'frozen',
    name: '百货日用',
    iconClass: 'i-mdi-home-city-outline',
    subCategories: [
      {
        id: 'daily',
        name: '日用清洁',
        bannerTitle: '企业常备百货',
        bannerSubtitle: '批量采购 更划算',
        tags: ['纸品', '垃圾袋', '清洁剂', '洗护'],
        products: buildProducts('daily', '百货', 5),
      },
    ],
  },
]

const selectedCategoryId = ref(categoryList[1].id)
const showAllCategoriesPanel = ref(false)
const selectedSubCategoryId = ref(categoryList[1].subCategories[0].id)
const showTagPopup = ref(false)

type SortMode = 'default' | 'price-asc' | 'price-desc' | 'sales'
const sortMode = ref<SortMode>('sales')

const cartCountMap = ref<Record<string, number>>({})
const showCartDetail = ref(false)

const topVisibleCategories = computed(() => categoryList.slice(0, 5))
const currentHotWord = computed(() => hotWords[hotWordIndex.value] || hotWords[0])
const activeCategory = computed(() => categoryList.find(item => item.id === selectedCategoryId.value) || categoryList[0])
const subCategories = computed(() => activeCategory.value.subCategories)
const activeSubCategory = computed(() => {
  const found = subCategories.value.find(item => item.id === selectedSubCategoryId.value)
  return found || subCategories.value[0]
})

const hiddenTagLimit = 5
const visibleTags = computed(() => activeSubCategory.value.tags.slice(0, hiddenTagLimit))
const hasMoreTags = computed(() => activeSubCategory.value.tags.length > hiddenTagLimit)

const sortedProducts = computed(() => {
  const list = [...activeSubCategory.value.products]
  if (sortMode.value === 'sales') {
    return list.sort((a, b) => b.sales - a.sales)
  }
  if (sortMode.value === 'price-asc') {
    return list.sort((a, b) => a.price - b.price)
  }
  if (sortMode.value === 'price-desc') {
    return list.sort((a, b) => b.price - a.price)
  }
  return list
})

const rankingMap = computed(() => {
  const rankSource = [...activeSubCategory.value.products].sort((a, b) => b.sales - a.sales)
  const map: Record<string, number> = {}
  rankSource.forEach((item, index) => {
    map[item.id] = index + 1
  })
  return map
})

const allProducts = computed(() => categoryList.flatMap(category => category.subCategories.flatMap(sub => sub.products)))
const cartProductCount = computed(() => Object.values(cartCountMap.value).reduce((sum, count) => sum + count, 0))
const cartSubtotal = computed(() => {
  const priceById = new Map(allProducts.value.map(item => [item.id, item.price]))
  return Number(Object.entries(cartCountMap.value).reduce((sum, [id, count]) => sum + (priceById.get(id) || 0) * count, 0).toFixed(1))
})
const shippingFee = computed(() => (cartSubtotal.value >= 199 ? 0 : 8))
const cartTotal = computed(() => Number((cartSubtotal.value + shippingFee.value).toFixed(1)))

function resolveMetrics() {
  const systemInfo = wx.getWindowInfo?.() || wx.getSystemInfoSync()
  const menuButton = wx.getMenuButtonBoundingClientRect()
  statusBarHeightPx.value = systemInfo.statusBarHeight || 20
  menuButtonHeightPx.value = menuButton.height || 32
  menuButtonWidthPx.value = menuButton.width || 88
}

function startHotWordTicker() {
  hotWordTimer = setInterval(() => {
    if (hotWordIndex.value >= hotWords.length - 1) {
      hotWordDirection.value = -1
    }
    else if (hotWordIndex.value <= 0) {
      hotWordDirection.value = 1
    }
    hotWordIndex.value += hotWordDirection.value
  }, 5000)
}

function handleChooseCategory(categoryId: string) {
  selectedCategoryId.value = categoryId
  selectedSubCategoryId.value = (categoryList.find(item => item.id === categoryId)?.subCategories[0]?.id) || ''
  showAllCategoriesPanel.value = false
  showTagPopup.value = false
}

function handleChooseSubCategory(subCategoryId: string) {
  selectedSubCategoryId.value = subCategoryId
  showTagPopup.value = false
}

function setSalesSort() {
  sortMode.value = 'sales'
}

function togglePriceSort() {
  if (sortMode.value === 'price-asc') {
    sortMode.value = 'price-desc'
    return
  }
  if (sortMode.value === 'price-desc') {
    sortMode.value = 'default'
    return
  }
  sortMode.value = 'price-asc'
}

function addToCart(productId: string) {
  cartCountMap.value = {
    ...cartCountMap.value,
    [productId]: (cartCountMap.value[productId] || 0) + 1,
  }
}

function getProductCount(productId: string) {
  return cartCountMap.value[productId] || 0
}

onMounted(() => {
  resolveMetrics()
  startHotWordTicker()
})

onUnmounted(() => {
  if (hotWordTimer) {
    clearInterval(hotWordTimer)
    hotWordTimer = null
  }
})

definePageJson({
  navigationBarTitleText: '分类',
  enablePullDownRefresh: true,
  backgroundColor: '#f5f5f5',
  navigationStyle: 'custom',
})
</script>

<template>
  <view class="category-page flex flex-col">
    <view class="category-page__header" :style="{ paddingTop: `${statusBarHeightPx}px` }">
      <view class="category-page__toolbar">
        <text class="category-page__title">分类</text>

        <view class="category-page__search-box">
          <view class="i-mdi-magnify category-page__search-icon" />
          <text class="category-page__search-word">{{ currentHotWord }}</text>
        </view>

        <view class="category-page__capsule" :style="{ height: `${menuButtonHeightPx}px`, width: `${menuButtonWidthPx}px` }" />
      </view>

      <view class="category-page__top-category-row">
        <scroll-view scroll-x class="category-page__top-scroll" show-scrollbar="false" enhanced>
          <view class="category-page__top-list">
            <view
              v-for="item in topVisibleCategories"
              :key="item.id"
              class="category-page__top-item"
              @tap="handleChooseCategory(item.id)"
            >
              <view class="category-page__top-icon-wrap" :class="selectedCategoryId === item.id ? 'category-page__top-icon-wrap--active' : ''">
                <view :class="`${item.iconClass} category-page__top-icon`" />
              </view>
              <text class="category-page__top-name" :class="selectedCategoryId === item.id ? 'category-page__top-name--active' : ''">{{ item.name }}</text>
            </view>
          </view>
        </scroll-view>

        <view class="category-page__all-entry" @tap="showAllCategoriesPanel = !showAllCategoriesPanel">
          <text>全</text>
          <text>部</text>
          <view class="i-mdi-dots-vertical" />
        </view>
      </view>

      <view v-if="showAllCategoriesPanel" class="category-page__all-panel">
        <view class="category-page__all-grid">
          <view
            v-for="item in categoryList"
            :key="item.id"
            class="category-page__all-card"
            :class="selectedCategoryId === item.id ? 'category-page__all-card--active' : ''"
            @tap="handleChooseCategory(item.id)"
          >
            <view :class="`${item.iconClass} category-page__all-card-icon`" />
            <text class="category-page__all-card-name">{{ item.name }}</text>
          </view>
        </view>
        <view class="category-page__all-close" @tap="showAllCategoriesPanel = false">
          点击收起 ^
        </view>
      </view>
    </view>

    <view class="category-page__main flex-1 min-h-0">
      <scroll-view scroll-y :show-scrollbar="false" enhanced class="category-page__sidebar">
        <view class="h-full border-r border-[#eee]">
          <view
            v-for="item in subCategories"
            :key="item.id"
            class="category-page__sub-item"
            :class="selectedSubCategoryId === item.id ? 'category-page__sub-item--active' : ''"
            @tap="handleChooseSubCategory(item.id)"
          >
            <text class="category-page__sub-text">{{ item.name }}</text>
          </view>
        </view>
      </scroll-view>

      <view class="category-page__content">
        <view class="category-page__content-top">
          <view class="category-page__banner">
            <view>
              <text class="category-page__banner-title">{{ activeSubCategory.bannerTitle }}</text>
              <text class="category-page__banner-subtitle">{{ activeSubCategory.bannerSubtitle }}</text>
            </view>
            <image :src="goodsImage" mode="aspectFill" class="category-page__banner-image" />
          </view>

          <view class="category-page__tag-row">
            <view class="category-page__tag-list">
              <text v-for="tag in visibleTags" :key="tag" class="category-page__tag-item">{{ tag }}</text>
            </view>
            <view v-if="hasMoreTags" class="category-page__tag-more" @tap="showTagPopup = !showTagPopup">
              <view :class="showTagPopup ? 'i-mdi-chevron-up' : 'i-mdi-chevron-down'" />
            </view>
          </view>

          <view v-if="showTagPopup && hasMoreTags" class="category-page__tag-popup">
            <text v-for="tag in activeSubCategory.tags" :key="tag" class="category-page__tag-item category-page__tag-item--popup">{{ tag }}</text>
          </view>

          <view class="category-page__sort-row">
            <view class="category-page__sort-item" :class="sortMode === 'sales' ? 'category-page__sort-item--active' : ''" @tap="setSalesSort">
              销量
            </view>
            <view class="category-page__sort-item" :class="sortMode === 'price-asc' || sortMode === 'price-desc' ? 'category-page__sort-item--active' : ''" @tap="togglePriceSort">
              价格
              <view class="category-page__sort-price-icons">
                <view class="i-mdi-menu-up" :class="sortMode === 'price-asc' ? 'category-page__sort-arrow--active' : ''" />
                <view class="i-mdi-menu-down" :class="sortMode === 'price-desc' ? 'category-page__sort-arrow--active' : ''" />
              </view>
            </view>
          </view>
        </view>

        <scroll-view scroll-y :show-scrollbar="false" enhanced class="category-page__goods-scroll">
          <view class="category-page__goods-list">
            <view v-for="item in sortedProducts" :key="item.id" class="category-page__goods-item">
              <image :src="goodsImage" mode="aspectFill" class="category-page__goods-image" />

              <view class="category-page__goods-main">
                <text class="category-page__goods-name">{{ item.name }}</text>

                <!-- <view class="category-page__goods-labels">
                <text v-for="tag in item.tags" :key="tag" class="category-page__goods-tag">{{ tag }}</text>
              </view> -->

                <text class="category-page__goods-origin">{{ item.origin }}</text>

                <view class="category-page__goods-features">
                  <text class="category-page__goods-delivery">{{ item.badges[0] || '次日达' }}</text>
                  <text class="category-page__goods-feature-text">{{ item.featureText }}</text>
                </view>

                <view class="category-page__goods-price-row">
                  <view class="category-page__goods-price-wrap">
                    <text class="category-page__goods-price">¥{{ item.price }}</text>
                    <text class="category-page__goods-unit">/袋</text>
                  </view>

                  <view class="category-page__cart-btn" @tap="addToCart(item.id)">
                    <view class="i-mdi-cart-outline category-page__cart-btn-icon" />
                    <text v-if="getProductCount(item.id) > 0" class="category-page__cart-btn-count">x{{ getProductCount(item.id) }}</text>
                  </view>
                </view>

                <view v-if="rankingMap[item.id] && rankingMap[item.id] <= 3" class="category-page__rank-badge">
                  {{ activeSubCategory.name }}回购榜<text class="italic font-bold text-[24rpx]">&nbsp;TOP.{{ rankingMap[item.id] }}</text>
                </view>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>

    <view v-if="cartProductCount > 0" class="category-page__cart-summary">
      <view class="category-page__cart-summary-left">
        <view class="category-page__cart-summary-icon-wrap">
          <view class="i-mdi-basket category-page__cart-summary-icon" />
          <text class="category-page__cart-summary-count">{{ cartProductCount }}</text>
        </view>

        <view class="category-page__cart-summary-price-wrap">
          <text class="category-page__cart-summary-price">¥{{ cartTotal }}</text>
          <text class="category-page__cart-summary-detail" @tap="showCartDetail = !showCartDetail">明细 {{ showCartDetail ? '^' : '∨' }}</text>
        </view>
      </view>

      <view class="category-page__checkout-btn">
        去下单
      </view>
    </view>

    <view v-if="showCartDetail && cartProductCount > 0" class="category-page__cart-detail-mask" @tap="showCartDetail = false">
      <view class="category-page__cart-detail-panel" @tap.stop>
        <view class="category-page__cart-detail-row">
          <text>商品小计</text>
          <text>¥{{ cartSubtotal }}</text>
        </view>
        <view class="category-page__cart-detail-row">
          <text>预计邮费</text>
          <text>¥{{ shippingFee }}</text>
        </view>
        <view class="category-page__cart-detail-row category-page__cart-detail-row--total">
          <text>合计</text>
          <text>¥{{ cartTotal }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.category-page {
  @apply flex h-[calc(100vh-98rpx-env(safe-area-inset-bottom))] flex-col overflow-hidden bg-[#f5f5f5];

  height: calc(100vh - 98rpx - constant(safe-area-inset-bottom));
}

.category-page__header {
  @apply bg-[#f5f5f5] px-[20rpx] pb-[16rpx];
}

.category-page__toolbar {
  @apply flex items-center gap-[14rpx] pb-[12rpx] pt-[10rpx];
}

.category-page__title {
  @apply text-[38rpx] font-medium leading-none text-[#222];
}

.category-page__search-box {
  @apply flex h-[68rpx] flex-1 items-center rounded-[999rpx] border border-[#2ea8ff] bg-white px-[20rpx];
}

.category-page__search-icon {
  @apply text-[44rpx] text-[#b9c0ca];
}

.category-page__search-word {
  @apply ml-[8rpx] text-[28rpx] font-medium text-[#c7c7c7];
}

.category-page__capsule {
  @apply flex items-center justify-around px-[8rpx];
}

.category-page__capsule-icon {
  @apply text-[30rpx] text-[#222];
}

.category-page__capsule-divider {
  @apply h-[26rpx] w-[1px] bg-[#e8e8e8];
}

.category-page__top-category-row {
  @apply relative flex items-center;
}

.category-page__top-scroll {
  @apply flex-1 whitespace-nowrap;
}

.category-page__top-list {
  @apply inline-flex items-start gap-[24rpx] pr-[110rpx];
}

.category-page__top-item {
  @apply inline-flex w-[108rpx] flex-col items-center;
}

.category-page__top-icon-wrap {
  @apply flex h-[88rpx] w-[88rpx] items-center justify-center rounded-full border-[3rpx] border-[#e5e7eb] bg-white;
}

.category-page__top-icon-wrap--active {
  @apply border-[#2ea8ff] shadow-[0_10rpx_20rpx_rgba(46,168,255,0.15)];
}

.category-page__top-icon {
  @apply text-[44rpx] text-[#fb923c];
}

.category-page__top-name {
  @apply mt-[8rpx] text-[22rpx] text-[#303133];
}

.category-page__top-name--active {
  @apply rounded-[999rpx] bg-[#2ea8ff] px-[10rpx] py-[2rpx] font-medium text-white;
}

.category-page__all-entry {
  @apply absolute right-0 top-0 z-[3] flex h-[138rpx] w-[72rpx] flex-col items-center justify-center rounded-l-[14rpx] bg-white text-[22rpx] font-medium leading-[32rpx] text-[#303133] shadow-[-8rpx_0_18rpx_rgba(31,41,55,0.08)];
}

.category-page__all-panel {
  @apply absolute right-[20rpx] top-[calc(100%+8rpx)] z-[20] w-[510rpx] rounded-[20rpx] bg-white p-[20rpx] shadow-[0_16rpx_42rpx_rgba(15,23,42,0.16)];
}

.category-page__all-grid {
  @apply grid grid-cols-3 gap-[14rpx];
}

.category-page__all-card {
  @apply flex flex-col items-center rounded-[14rpx] bg-[#f7f8fa] px-[8rpx] py-[14rpx] text-center;
}

.category-page__all-card--active {
  @apply bg-[#ebf7ff] ring-1 ring-[#2ea8ff];
}

.category-page__all-card-icon {
  @apply text-[38rpx] text-[#fb923c];
}

.category-page__all-card-name {
  @apply mt-[6rpx] text-[24rpx] text-[#303133];
}

.category-page__all-close {
  @apply mt-[16rpx] text-center text-[24rpx] text-[#6b7280];
}

.category-page__main {
  @apply mt-[14rpx] flex min-h-0 flex-1 overflow-hidden rounded-t-[24rpx] bg-white;
}

.category-page__sidebar {
  // border-right: 1px solid #eee;

  @apply h-full w-[170rpx] shrink-0 bg-[#FAFAFA] py-[10rpx] pt-0;
}

.category-page__sub-item {
  @apply relative flex min-h-[96rpx] items-center justify-center px-[8rpx] py-[10rpx] text-center;

  &:first-child {
    @apply rounded-tl-[24rpx];
  }
}

.category-page__sub-item--active {
  @apply bg-white;
}

.category-page__sub-item--active {
  @apply relative border-t border-t-[#EEE] border-b border-b-[#EEE];

  .category-page__sub-text {
    @apply font-semibold text-[#0AAFFF];
  }

  &:first-child {
    @apply border-t-transparent;
  }

  &::after {
    content: '';

    @apply absolute right-[-2px] top-0 h-full w-[2px] bg-white;
  }

  &::before {
    content: '';

    @apply absolute left-0 top-[24rpx] h-[48rpx] w-[6rpx] rounded-r-[999rpx] bg-[#2ea8ff];
  }
}

.category-page__sub-text {
  @apply text-[24rpx] text-[#303133];
}

.category-page__content {
  @apply flex h-full min-w-0 flex-1 flex-col min-h-0 px-[20rpx];
}

.category-page__content-top {
  @apply pt-[16rpx];
}

.category-page__goods-scroll {
  @apply min-h-0 flex-1 pb-[20rpx];
}

.category-page__banner {
  @apply flex items-center justify-between overflow-hidden rounded-[24rpx] bg-gradient-to-r from-[#32325d] to-[#20233d] px-[20rpx] py-[16rpx];
}

.category-page__banner-title {
  @apply block text-[32rpx] font-semibold text-white;
}

.category-page__banner-subtitle {
  @apply mt-[6rpx] block text-[24rpx] text-[#e7e7ee];
}

.category-page__banner-image {
  @apply h-[90rpx] w-[198rpx] rounded-[18rpx] opacity-90;
}

.category-page__tag-row {
  @apply mt-[16rpx] flex items-start;
}

.category-page__tag-list {
  @apply flex flex-1 flex-wrap gap-[10rpx];
}

.category-page__tag-item {
  @apply rounded-[10rpx] bg-[#eef1f5] px-[18rpx] py-[8rpx] text-[22rpx] text-[#4b5563];
}

.category-page__tag-more {
  @apply ml-[8rpx] flex h-[46rpx] w-[56rpx] items-center justify-center rounded-[10rpx] bg-[#eef1f5] text-[24rpx] text-[#6b7280];
}

.category-page__tag-popup {
  @apply mt-[10rpx] flex flex-wrap gap-[10rpx] rounded-[14rpx] bg-[#f6f7fb] p-[12rpx];
}

.category-page__tag-item--popup {
  @apply bg-white;
}

.category-page__sort-row {
  @apply mt-[14rpx] flex items-center justify-end gap-[32rpx] border-b border-[#f0f0f0] pb-[12rpx] pr-[4rpx];
}

.category-page__sort-item {
  @apply inline-flex items-center text-[24rpx] text-[#5f6470];
}

.category-page__sort-item--active {
  @apply font-semibold text-[#20232a];
}

.category-page__sort-price-icons {
  @apply ml-[2rpx] flex flex-col leading-none;
}

.category-page__sort-arrow--active {
  @apply text-[#2ea8ff];
}

.category-page__goods-list {
  @apply bg-white;
}

.category-page__goods-item {
  @apply flex border-b border-[#f2f3f5] py-[20rpx] last:border-b-0;
}

.category-page__goods-image {
  @apply h-[174rpx] w-[174rpx] shrink-0 rounded-[24rpx] bg-[#f4f4f4];
}

.category-page__goods-main {
  @apply ml-[18rpx] min-w-0 flex-1;
}

.category-page__goods-name {
  @apply block truncate text-[32rpx] font-semibold text-[#2b2f37];
}

.category-page__goods-labels {
  @apply mt-[8rpx] flex flex-wrap gap-[8rpx];
}

.category-page__goods-tag {
  @apply rounded-[8rpx] bg-[#2563eb] px-[10rpx] py-[2rpx] text-[24rpx] text-white;
}

.category-page__goods-origin {
  @apply mt-[6rpx] block truncate text-[22rpx] text-[#8d8f98];
}

.category-page__goods-features {
  @apply mt-[6rpx] flex items-center gap-[10rpx];
}

.category-page__goods-delivery {
  @apply rounded-[8rpx] border border-[#2ea8ff] px-[8rpx] py-[2rpx] text-[20rpx] text-[#2ea8ff];
}

.category-page__goods-feature-text {
  @apply text-[22rpx] text-[#c58d2f];
}

.category-page__goods-price-row {
  @apply mt-[8rpx] flex items-center justify-between;
}

.category-page__goods-price-wrap {
  @apply flex items-end;
}

.category-page__goods-price {
  @apply text-[42rpx] font-bold leading-none text-[#ff5a36];
}

.category-page__goods-unit {
  @apply ml-[4rpx] text-[22rpx] text-[#b6b7bd];
}

.category-page__member-price {
  @apply mt-[8rpx] block text-[32rpx] font-semibold text-[#23262f];
}

.category-page__cart-btn {
  @apply relative flex h-[48rpx] w-[48rpx] items-center justify-center rounded-full bg-[#15a2f2] text-white;
}

.category-page__cart-btn-icon {
  @apply text-[38rpx];
}

.category-page__cart-btn-count {
  @apply absolute -right-[14rpx] -top-[14rpx] rounded-[999rpx] bg-[#ff5a36] px-[8rpx] py-[2rpx] text-[22rpx] font-semibold leading-none;
}

.category-page__rank-badge {
  @apply mt-[10rpx] inline-flex rounded-sm bg-[#FAF5ED] px-[14rpx] py-[4rpx] text-[22rpx] text-[#CC9B46];
}

.category-page__cart-summary {
  @apply fixed left-[20rpx] right-[20rpx] z-[80] flex items-center justify-between rounded-[999rpx] bg-white px-[20rpx] py-[14rpx] shadow-[0_-8rpx_30rpx_rgba(31,45,61,0.12)];

  bottom: calc(120rpx + env(safe-area-inset-bottom));
  bottom: calc(120rpx + constant(safe-area-inset-bottom));
}

.category-page__cart-summary-left {
  @apply flex items-center;
}

.category-page__cart-summary-icon-wrap {
  @apply relative mr-[12rpx] flex h-[72rpx] w-[72rpx] items-center justify-center rounded-full bg-[#e0f5ff];
}

.category-page__cart-summary-icon {
  @apply text-[40rpx] text-[#13a0ef];
}

.category-page__cart-summary-count {
  @apply absolute -right-[10rpx] -top-[8rpx] rounded-[999rpx] bg-[#ff5a36] px-[8rpx] py-[2rpx] text-[22rpx] text-white;
}

.category-page__cart-summary-price-wrap {
  @apply flex items-baseline;
}

.category-page__cart-summary-price {
  @apply text-[58rpx] font-semibold text-[#ff4f2f];
}

.category-page__cart-summary-detail {
  @apply ml-[8rpx] text-[32rpx] text-[#ff4f2f];
}

.category-page__checkout-btn {
  @apply min-w-[238rpx] rounded-[999rpx] bg-[#15a2f2] px-[26rpx] py-[14rpx] text-center text-[46rpx] font-medium text-white;
}

.category-page__cart-detail-mask {
  @apply fixed inset-0 z-[79] bg-[rgba(0,0,0,0.2)];
}

.category-page__cart-detail-panel {
  @apply absolute left-[20rpx] right-[20rpx] rounded-[24rpx] bg-white p-[20rpx];

  bottom: calc(240rpx + env(safe-area-inset-bottom));
  bottom: calc(240rpx + constant(safe-area-inset-bottom));
}

.category-page__cart-detail-row {
  @apply flex items-center justify-between py-[8rpx] text-[30rpx] text-[#4b5563];
}

.category-page__cart-detail-row--total {
  @apply border-t border-[#f0f0f0] pt-[14rpx] text-[34rpx] font-semibold text-[#111827];
}
</style>
