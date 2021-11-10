/**
 * 定义需要的 api
 */

import { cloneDeep, get, isEmpty, map, omitBy } from 'lodash'

import { app } from '@core/app'
import { ReqOption, ReqApiRes } from '@core/utils/request/types'

import { ApiName, ApiType } from '../types'

// API 端点
export const apis = {
  user: {
    login: {
      url: 'POST /v1/user/login',
    },
    list: {
      url: 'GET /v1/user',
    },
    one: {
      url: 'GET /v1/user/$id',
    },
    add: {
      url: 'POST /v1/user',
    },
    edit: {
      url: 'PUT /v1/user/$id',
    },
    del: {
      url: 'DELETE /v1/user/$id',
    },
  },
  config: {
    list: {
      url: 'GET /v1/config',
    },
    one: {
      url: 'GET /v1/config/$id',
    },
    add: {
      url: 'POST /v1/config',
    },
    edit: {
      url: 'PUT /v1/config/$id',
    },
    del: {
      url: 'DELETE /v1/config/$id',
    },
  },
  file: {
    upload: {
      url: 'POST /v1/file?has_domain=yes',
    },
  },
  category: {
    // 配置
    list: {
      url: 'GET /v1/category',
    },
    one: {
      url: 'GET /v1/category/$id',
    },
    add: {
      url: 'POST /v1/category',
    },
    edit: {
      url: 'PUT /v1/category/$id',
    },
    del: {
      url: 'DELETE /v1/category/$id',
    },
  },
  product: {
    list: {
      url: 'GET /v1/product',
    },
    one: {
      url: 'GET /v1/product/$id',
    },
    add: {
      url: 'POST /v1/product',
    },
    edit: {
      url: 'PUT /v1/product/$id',
    },
    del: {
      url: 'DELETE /v1/product/$id',
    },
  },
  authorization: {
    list: {
      url: 'GET /v1/authorization',
    },
    one: {
      url: 'GET /v1/authorization/$id',
    },
    add: {
      url: 'POST /v1/authorization',
    },
    edit: {
      url: 'PUT /v1/authorization/$id',
    },
    del: {
      url: 'DELETE /v1/authorization/$id',
    },
  },
}

type QueryOption = { [key: string]: string | number }

export const getApiConditionStr = (conditions: QueryOption, comma: boolean = false): string => {
  if (!conditions) {
    return ''
  }

  let str = ''

  map(conditions, (val, key) => {
    if (typeof val !== 'undefined' || val !== '') {
      str += comma ? `"${key}":"${val}",` : `${key}:${val},`
    }
  })

  return str.slice(0, -1)
}

// 获取请求参数
export const getApiQuery = (data: any) => {
  const { type, query, names, ...reset } = data
  const queryObj: any = {}
  const namesObj: any = {}

  const omitInvalidParams = (p: object): any =>
    omitBy(p, (v) => v === '' || typeof v === 'undefined')

  map(reset, (val, key) => {
    if (key.startsWith('q_')) {
      queryObj[key.slice(2)] = val
    } else if (key.startsWith('n_')) {
      namesObj[key.slice(2)] = val
    }
  })

  const queryParams = {
    type,
    ...reset,
    query: getApiConditionStr(
      omitInvalidParams({
        ...query,
        ...queryObj,
      })
    ),
    names: getApiConditionStr(
      omitInvalidParams({
        ...names,
        ...namesObj,
      }),
      true
    ),
  }

  return omitInvalidParams(queryParams)
}

export const getOneItem = (source: any) => {
  return get(source, 'data.items.0') || {}
}

export const getApiOption = (
  option: ReqOption & {
    apiName: ApiName
    apiType: ApiType
  }
) => {
  const { apiType, apiName, ...rest } = option
  const apiInfo = get(apis, `${apiType}.${apiName}`)

  return {
    ...apiInfo,
    ...rest,
  }
}

export const getReqOption = (
  apiOption: ApiData & {
    apiType: ApiType
    apiName: ApiName
  },
  option?: ReqOption
) => {
  const { apiType, apiName, ...data } = apiOption
  const apiInfo = cloneDeep(get(apis, `${apiType}.${apiName}`))

  if (data.id) {
    apiInfo.url = apiInfo.url.replace('$id', data.id)
  }

  return {
    data: isEmpty(data) ? undefined : data,
    ...apiInfo,
    ...option,
  }
}

export type ApiData = {
  onlyOne?: boolean // 从list中选取第一个作为返回数据
  onlyData?: boolean // 只返回接口中 data 数据
  withHttp?: boolean // 返回整个 http 请求所有内容
  [key: string]: any
}

// 增加调用参数简化
export function requestByOption<T = {}>(
  apiOption: ApiData & {
    apiType: ApiType
    apiName: ApiName
  },
  option?: ReqOption
) {
  const { apiType, apiName, ...data } = apiOption
  return request<T>(`${apiType}.${apiName}`, data, option)
}

// data:  onlyOne 获取 items 单独的一个
export function request<T = {}>(apiKey: string, data?: ApiData, option?: ReqOption) {
  const apiInfo = cloneDeep(get(apis, apiKey))

  const { onlyOne, onlyData = true, withHttp = false, ...params } = data || {}

  const reqOption = {
    domain: 'api',
    data: params,
    ...apiInfo,
    ...option,
  }

  // 简化数据读取逻辑
  const req = app.request<T>(reqOption).then((source) => {
    if (withHttp) {
      return source
    }

    if (onlyOne) {
      const apiData = source.data
      apiData.data = getOneItem(apiData)

      return onlyData ? apiData.data : apiData
    }

    if (onlyData) {
      return source.data.data
    }

    return source.data
  })

  return req as Promise<ReqApiRes<T>>
}
