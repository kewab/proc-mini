export interface ApiResponse<T> {
  code: number
  msg: string
  data: T
}

type HeaderMap = Record<string, string>

// 请求超时时间
const REQUEST_TIMEOUT = 10 * 1000

// 获取小程序元数据
function getMiniProgramMeta() {
  const accountInfo = wx.getAccountInfoSync?.()
  const miniProgram = accountInfo?.miniProgram
  return {
    appId: miniProgram?.appId || '',
    envVersion: miniProgram?.envVersion || '',
    mpVersion: miniProgram?.version || '',
  }
}

// 获取客户端元数据
function getClientMeta() {
  const systemInfo = wx.getDeviceInfo()
  return {
    brand: systemInfo.brand || '',
    model: systemInfo.model || '',
    platform: systemInfo.platform || '',
    system: systemInfo.system || '',
  }
}

// 构建基础头
function buildBaseHeaders(): HeaderMap {
  const token = `${wx.getStorageSync('token') || ''}`.trim()
  const timestamp = `${Date.now()}`
  const { appId, envVersion, mpVersion } = getMiniProgramMeta()
  const { brand, model, platform, system } = getClientMeta()

  return {
    'X-Token': token,
    'X-Timestamp': timestamp,
    'X-MP-AppId': appId,
    'X-MP-Env': envVersion,
    'X-MP-Version': mpVersion,
    'X-Client-Platform': platform,
    'X-Client-System': system,
    'X-Client-Brand': brand,
    'X-Client-Model': model,
  }
}

function parseResponseData<T>(payload: unknown) {
  const data = payload as Partial<ApiResponse<T>>
  if (typeof data?.code === 'number') {
    return data
  }
  return {
    code: 0,
    msg: 'success',
    data: payload as T,
  } as ApiResponse<T>
}

function rejectWithToast(
  reject: (reason?: any) => void,
  message: string,
) {
  wx.showToast({
    title: message,
    icon: 'error',
  })
  reject(message)
}

export async function request<T>(options: WechatMiniprogram.RequestOption) {
  const headers = {
    ...buildBaseHeaders(),
    ...(options.header as HeaderMap | undefined),
  }

  return new Promise<T>((resolve, reject) => {
    wx.request({
      timeout: REQUEST_TIMEOUT,
      ...options,
      header: headers,
      success(res) {
        if (res.statusCode < 200 || res.statusCode >= 300) {
          rejectWithToast(reject, '服务器返回异常')
          return
        }
        const data = parseResponseData<T>(res.data)
        if (data.code === 0) {
          resolve(data.data as T)
          return
        }
        rejectWithToast(reject, data.msg || '请求失败')
      },
      fail() {
        rejectWithToast(reject, '请求失败')
      },
    })
  })
}
