import { computed, defineStore, ref, watch } from 'wevu'
import goodsImage from '@/assets/images/home/goods-1.png'

const CART_STORAGE_KEY = 'proc-mini-cart-store'
const DEFAULT_SHIPPING_FEE = 8
const FREE_SHIPPING_THRESHOLD = 199

export interface CartItemPayload {
  id: string
  image?: string
  name: string
  price: number
  quantity?: number
  selected?: boolean
  subtitle?: string
  tag?: string
  unit?: string
}

export interface CartItem extends Required<Omit<CartItemPayload, 'image' | 'quantity' | 'selected'>> {
  image: string
  quantity: number
  selected: boolean
}

export type CartDetailMode = 'all' | 'selected'

export interface CartFlyRequest {
  key: number
  startX: number
  startY: number
}

interface PersistedCartState {
  items?: CartItem[]
}

const seedCartItems: CartItem[] = [
  {
    id: 'beef-1',
    image: goodsImage,
    name: '进口牛肋肉1kg',
    subtitle: '进口原切 | 去骨带筋',
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
    subtitle: '牛腱腱芯 | 适合酱卤',
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
    subtitle: '谷饲慢养 | 纹理清晰',
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
    subtitle: '深海急冻 | 鲜味十足',
    price: 75.8,
    quantity: 1,
    selected: true,
    tag: '明日达',
    unit: '盒',
  },
]

function normalizeCartItem(payload: CartItemPayload): CartItem {
  return {
    id: payload.id,
    image: payload.image || goodsImage,
    name: payload.name,
    subtitle: payload.subtitle || '',
    price: Number(payload.price.toFixed(1)),
    quantity: Math.max(1, payload.quantity || 1),
    selected: payload.selected ?? true,
    tag: payload.tag || '明日达',
    unit: payload.unit || '件',
  }
}

function normalizeCartItems(items: CartItemPayload[]) {
  return items.map(item => normalizeCartItem(item))
}

function computeShippingFee(amount: number) {
  if (amount <= 0) {
    return 0
  }
  return amount >= FREE_SHIPPING_THRESHOLD ? 0 : DEFAULT_SHIPPING_FEE
}

function readPersistedItems() {
  try {
    const stored = wx.getStorageSync(CART_STORAGE_KEY) as PersistedCartState | string | undefined

    if (!stored) {
      return normalizeCartItems(seedCartItems)
    }

    const parsed = typeof stored === 'string' ? JSON.parse(stored) as PersistedCartState : stored
    if (!Array.isArray(parsed?.items) || parsed.items.length === 0) {
      return normalizeCartItems(seedCartItems)
    }

    return normalizeCartItems(parsed.items)
  }
  catch {
    return normalizeCartItems(seedCartItems)
  }
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>(readPersistedItems())
  const detailVisible = ref(false)
  const detailMode = ref<CartDetailMode>('all')
  const flyRequest = ref<CartFlyRequest | null>(null)
  const flyRequestKey = ref(0)

  const cartItems = computed(() => items.value)
  const cartItemCount = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0))
  const cartAmount = computed(() => Number(items.value.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(1)))
  const cartShippingFee = computed(() => computeShippingFee(cartAmount.value))
  const cartPayableAmount = computed(() => Number((cartAmount.value + cartShippingFee.value).toFixed(1)))

  const selectedItems = computed(() => items.value.filter(item => item.selected))
  const selectedProductCount = computed(() => selectedItems.value.reduce((sum, item) => sum + item.quantity, 0))
  const selectedAmount = computed(() => Number(selectedItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(1)))
  const selectedShippingFee = computed(() => computeShippingFee(selectedAmount.value))
  const selectedPayableAmount = computed(() => Number((selectedAmount.value + selectedShippingFee.value).toFixed(1)))
  const allSelected = computed(() => items.value.length > 0 && items.value.every(item => item.selected))

  function persistItems() {
    wx.setStorageSync(CART_STORAGE_KEY, JSON.stringify({ items: items.value }))
  }

  function syncItem(id: string, updater: (item: CartItem) => CartItem) {
    items.value = items.value.map((item) => {
      if (item.id !== id) {
        return item
      }
      return normalizeCartItem(updater(item))
    })
  }

  function addItem(payload: CartItemPayload) {
    const existing = items.value.find(item => item.id === payload.id)

    if (existing) {
      syncItem(payload.id, item => ({
        ...item,
        image: payload.image || item.image,
        name: payload.name || item.name,
        price: payload.price,
        subtitle: payload.subtitle ?? item.subtitle,
        tag: payload.tag ?? item.tag,
        unit: payload.unit ?? item.unit,
        quantity: item.quantity + Math.max(1, payload.quantity || 1),
        selected: true,
      }))
      return
    }

    items.value = [...items.value, normalizeCartItem(payload)]
  }

  function toggleItemSelected(id: string) {
    syncItem(id, item => ({
      ...item,
      selected: !item.selected,
    }))
  }

  function setItemSelected(id: string, selected: boolean) {
    syncItem(id, item => ({
      ...item,
      selected,
    }))
  }

  function setAllSelected(selected: boolean) {
    items.value = items.value.map(item => normalizeCartItem({
      ...item,
      selected,
    }))
  }

  function changeQuantity(id: string, delta: number) {
    syncItem(id, item => ({
      ...item,
      quantity: Math.max(1, item.quantity + delta),
    }))
  }

  function updateQuantity(id: string, quantity: number) {
    syncItem(id, item => ({
      ...item,
      quantity: Math.max(1, quantity),
    }))
  }

  function removeSelected() {
    items.value = items.value.filter(item => !item.selected)
  }

  function openDetail(mode: CartDetailMode = 'all') {
    detailMode.value = mode
    detailVisible.value = true
  }

  function closeDetail() {
    detailVisible.value = false
  }

  function clearCart() {
    items.value = []
    closeDetail()
  }

  function requestFlyToCart(startX: number, startY: number) {
    flyRequestKey.value += 1
    flyRequest.value = {
      key: flyRequestKey.value,
      startX,
      startY,
    }
  }

  watch(items, persistItems, { deep: true })

  return {
    items,
    cartItems,
    cartItemCount,
    cartAmount,
    cartShippingFee,
    cartPayableAmount,
    selectedItems,
    selectedProductCount,
    selectedAmount,
    selectedShippingFee,
    selectedPayableAmount,
    allSelected,
    detailVisible,
    detailMode,
    flyRequest,
    flyRequestKey,
    addItem,
    toggleItemSelected,
    setItemSelected,
    setAllSelected,
    changeQuantity,
    updateQuantity,
    removeSelected,
    clearCart,
    openDetail,
    closeDetail,
    requestFlyToCart,
  }
})
