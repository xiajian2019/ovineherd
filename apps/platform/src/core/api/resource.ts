/**
 * 由于后端接口设计很特殊
 * 因此将页面所有要调的接口，全部封装在这里
 */
import { toast } from 'amis'
import { get } from 'lodash'

import { ReqOption } from '@core/utils/request/types'
import { setStore } from '@ovine/core/lib/utils/store'

import { relation, storeKey } from '../constants'
import { ApiName, ApiType } from '../types'
import { getLink, getOrgId, getOrgUniType, isStrTrue, isSys, linkTo } from '../utils'
import { ApiData, getReqOption, requestByOption } from './utils'


function getSysLimit(source: any) {
  if (get(source, 'relation4_data.is_root')) {
    source.isOrgRoot = true
    return source
  }
  const limitId = get(source, 'relation4_data.relation2') || ''

  if (!limitId) {
    toast.error('当前账号暂无权限，请联系管理员设置权限，再重新登录。', '权限异常', {
      timeout: 4000,
    })
    linkTo(getLink('login'))
    return source
  }

  return requestByOption({
    apiType: ApiType.authorization,
    apiName: ApiName.one,
    id: limitId,
  })
    .then((limit) => {
      const limitArr = JSON.parse(limit.limit_data)
      const limits: any = {}
      limitArr.forEach((i) => {
        limits[i] = 1
      })
      source.org_limit = limits
      return source
    })
    .catch((__) => {
      toast.error('获取权限数据异常', '权限异常', { timeout: 4000 })
      linkTo(getLink('login'))
      return source
    })
}

// 根据 token 获取用户信息
export function userSelfInfoApi(data: ApiData, option?: ReqOption) {
  return requestByOption(
    {
      apiType: ApiType.user,
      apiName: ApiName.one,
      ...data,
    },
    option
  ).then((source) => {
    // 暂不处理 sys
    if (isSys()) {
      return source
    }

    return getSysLimit(source)
  })
}

export function userSelfInfoReqOpt(data: ApiData, option?: ReqOption) {
  const reqOption = getReqOption(
    {
      apiType: ApiType.user,
      apiName: ApiName.one,
      ...data,
    },
    option
  )

  return reqOption
}

// 系统用户登录
export function sysUserLoginApi(option: ApiData) {
  return requestByOption(
    {
      apiType: ApiType.user,
      apiName: ApiName.login,
      onlyData: false,
      ...option,
    },
    {
      // 不提示错误信息
      onSuccess: (source) => {
        source.code = source.status
        source.status = 0
        return source
      },
    }
  )
}

export function sysUserLogoutApi() {
  //
}

// 获取 平台配置
export function sysConfigApi() {
  // 平台配置由系统 初始化生成
  return requestByOption({
    onlyOne: true,
    apiName: ApiName.list,
    ...relation.sys.sysInfo,
  }).then((sysInfo) => {
    setStore(storeKey.sysInfo, sysInfo)
    return sysInfo
  })
}

// 获取 组织配置
export function orgConfigApi(option: { orgId: string }) {
  return requestByOption({
    ...relation.org.entity,
    apiName: ApiName.one,
    id: option.orgId,
  }).then((source) => {
    const orgInfo = source.relation1_data
    setStore(storeKey.orgInfo, orgInfo)
    return orgInfo
  })
}

// 平台管理员 添加一个组织
export async function sysCreateOrgApi(option: any) {
  const { username, password, ...rest } = option

  const ids = {
    orgAdmUserId: '',
    orgInfoId: '',
    teamId: '',
    orgId: '',
    roleId: '',
  }

  try {
    // 添加一个 组织对应配置
    const { id: orgInfoId } = await requestByOption({
      ...rest,
      ...relation.org.orgInfo,
      apiName: ApiName.add,
    })
    ids.orgInfoId = `${orgInfoId}`

    // 创建一个组织， 并将 配置 关联到该组织
    const { id: orgId } = await requestByOption({
      ...relation.org.entity,
      apiName: ApiName.add,
      relation1: ids.orgInfoId,
      // relation2: ids.orgAdmUserId,
    })
    ids.orgId = `${orgId}`

    // 为组织添加一个团队
    const { id: teamId } = await requestByOption({
      ...relation.org.team,
      apiName: ApiName.add,
      relation1: orgId,
      is_root: '1', // 标志是根节点
      label: rest.name || '团队', // 团队主节点名字
      removable: '', // 无法删除
    })
    ids.teamId = teamId

    // 添加一个 组织用户
    const { id: orgAdmUserId } = await requestByOption({
      username,
      password,
      ...relation.org.user,
      type: getOrgUniType('user', ids.orgId),
      leader: '1',
      is_root: '1', // 是否该组织的主要管理员
      relation3: ids.teamId,
      apiName: ApiName.add,
    })
    ids.orgAdmUserId = `${orgAdmUserId}`

    // 添加一个 超级权限 角色
    const { id: roleId } = await requestByOption({
      ...relation.org.role,
      apiName: ApiName.add,
      relation1: orgId,
      is_root: '1', // 超级权限
      name: '超级权限',
      desc: '由系统自动创建，拥有该组织所有权限，请谨慎操作。',
    })
    ids.roleId = `${roleId}`

    // 将创建的 组织 关联到该组织用户
    await requestByOption({
      apiType: relation.org.user.apiType,
      apiName: ApiName.edit,
      id: ids.orgAdmUserId,
      relation2: ids.orgId, // 关联组织
      relation4: ids.roleId, // 关联权限
      desc: '本组织超级管理员',
    })

    // 将 管理员 关联到 该组织
    await requestByOption({
      apiType: relation.org.entity.apiType,
      apiName: ApiName.edit,
      id: ids.orgId,
      relation2: ids.orgAdmUserId,
    })

    return ids
  } catch (e) {
    // 防止垃圾，每次创建失败 一堆垃圾数据
    if (ids.orgAdmUserId) {
      await requestByOption({
        ...relation.org.user,
        id: ids.orgAdmUserId,
        apiName: ApiName.del,
      })
    }

    if (ids.teamId) {
      await requestByOption({
        ...relation.org.team,
        id: ids.teamId,
        apiName: ApiName.del,
      })
    }

    if (ids.orgInfoId) {
      await requestByOption({
        ...relation.org.orgInfo,
        id: ids.orgInfoId,
        apiName: ApiName.del,
      })
    }

    if (ids.orgId) {
      await requestByOption({
        ...relation.org.entity,
        id: ids.orgId,
        apiName: ApiName.del,
      })
    }

    if (ids.roleId) {
      await requestByOption({
        ...relation.org.role,
        apiName: ApiName.del,
        id: ids.roleId,
      })
    }

    throw Error('创建组织失败')
  }
}

// 组织管理员 添加一个应用
export async function sysCreateAppApi(option: any) {
  const { username, password, ...rest } = option

  const ids = {
    appAdminId: '',
    appInfoId: '',
    appId: '',
  }

  const isIsolation = isStrTrue(rest.isolation)

  try {
    // 添加一个 应用 对应配置
    const { id: appInfoId } = await requestByOption({
      ...rest,
      ...relation.app.appInfo,
      apiName: ApiName.add,
    })
    ids.appInfoId = `${appInfoId}`

    // 创建一个应用， 并将 配置/用户 关联到该应用
    const { id: appId } = await requestByOption({
      ...relation.app.entity,
      apiName: ApiName.add,
      relation1: ids.appInfoId,
      relation2: getOrgId(),
    })
    ids.appId = `${appId}`

    if (isIsolation) {
      // 添加一个 应用用户
      const { id: appAdminId } = await requestByOption({
        username,
        password,
        ...relation.app.user,
        type: `${relation.app.user.type}_${ids.appId}`,
        apiName: ApiName.add,
      })
      ids.appAdminId = `${appAdminId}`

      // 将创建的 应用 关联到该应用管理员
      await requestByOption({
        apiType: relation.app.user.apiType,
        apiName: ApiName.edit,
        id: ids.appAdminId,
        relation2: ids.appId,
      })

      // 将 管理员 关联到 该应用
      await requestByOption({
        apiType: relation.app.entity.apiType,
        apiName: ApiName.edit,
        id: ids.appId,
        relation3: ids.appAdminId,
      })
    }

    return ids
  } catch (e) {
    // 防止垃圾每次创建失败 一堆垃圾数据
    if (ids.appAdminId) {
      await requestByOption({
        ...relation.app.user,
        id: ids.appAdminId,
        apiName: ApiName.del,
      })
    }

    if (ids.appInfoId) {
      await requestByOption({
        ...relation.app.appInfo,
        id: ids.appInfoId,
        apiName: ApiName.del,
      })
    }

    if (ids.appId) {
      await requestByOption({
        ...relation.app.entity,
        id: ids.appId,
        apiName: ApiName.del,
      })
    }

    throw Error('创建组织失败')
  }
}
