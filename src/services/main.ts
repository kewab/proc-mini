import { request } from '@/utils/request'

export function Login() {
  return request<any>({
    url: 'https://wx.test.cn/api/v1/push',
    method: 'POST',
  })
}
