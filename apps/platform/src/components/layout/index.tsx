import React from 'react'
import { useRouteMatch } from 'react-router-dom'

import OrgRoutes from '~/routes/org'
import SysRoutes from '~/routes/sys'

import { useAppContext } from '../app/context'

import Header from './header'
import * as S from './styled'

const menus = {
  org: [
    {
      label: '应用',
      link: 'application',
    },
    {
      label: '团队',
      link: 'team',
    },
    {
      label: '角色',
      link: 'role',
    },
    {
      label: '设置',
      link: 'setting',
    },
  ],
  sys: [
    {
      label: '组织',
      link: 'org',
    },
    {
      label: '平台用户',
      link: 'user',
    },
    {
      label: '设置',
      link: 'setting',
    },
  ],
}

type LayoutProps = {
  children: any
}
export default (props: LayoutProps) => {
  const { children } = props
  const { path, url } = useRouteMatch()
  const { appInfo } = useAppContext()

  return (
    <S.Layout>
      <Header menus={menus[appInfo.type]} urlPrefix={url} />
      <S.Body className="py-4">
        {appInfo.isOrg ? <OrgRoutes pathPrefix={path} /> : <SysRoutes pathPrefix={path} />}
        {children}
      </S.Body>
    </S.Layout>
  )
}