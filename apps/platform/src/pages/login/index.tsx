/**
 * 平台登录
 */

import React from 'react'
import { useHistory, useLocation, Link } from 'react-router-dom'

import { useImmer } from '@core/utils/hooks'
import { setStore } from '@core/utils/store'

import { sysUserLoginApi } from '~/core/api/resource'
import { storeKey } from '~/core/constants'

import { Login } from './styled'

const imgSrc = 'https://static.igroupes.com/ovine_bg_cxd.jpeg'

type State = {
  inputs: {
    username: string
    password: string
  }
  loading: boolean
  tips: {
    error?: string
  }
}

const initState = {
  inputs: {
    username: '',
    password: '',
  },
  loading: false,
  tips: {},
}
export default () => {
  const history = useHistory()
  const location = useLocation()

  const [state, setState] = useImmer<State>(initState)
  // const { setContext} = useAppContext()

  const { inputs, tips, loading } = state

  const onInputChange = (e: any) => {
    const { name, value } = e.target
    setState((d) => {
      d.inputs[name] = value
    })
  }

  const setErrorTip = (tip: string) => {
    setState((d) => {
      d.tips.error = tip
    })
  }

  const onSubmit = () => {
    const { password, username } = inputs
    if (!username) {
      setErrorTip('请输入用户名')
      return
    }
    if (!password) {
      setErrorTip('请输入密码')
      return
    }
    setState((d) => {
      d.loading = true
    })

    sysUserLoginApi({
      ...inputs,
      onlyData: false,
    }).then((data: any) => {
      setState((d) => {
        d.loading = false
      })
      // const { code, msg, data } = source || {}
      // if (code) {
      //   setErrorTip(msg)
      //   return
      // }

      setStore(storeKey.auth, data.id)
      setStore(storeKey.userInfo, data)

      const locState: any = location.state || { from: { pathname: '/sys/' } }
      history.replace(locState.from)
    })
  }

  return (
    <Login>
      <img src={imgSrc} alt="" className="img-bk" />
      <div className="login-card">
        <div className="side login-form">
          <div className="img-brand">
            <img alt="logo" src="https://ovine.igroupes.com/demo/static/images/logo_grey.png" />
            <span>OvineHerd 低代码平台</span>
          </div>

          <span>账号</span>
          <input
            type="text"
            name="username"
            value={inputs.username || ''}
            onChange={onInputChange}
            placeholder="请输入账号"
          />

          <span>密码</span>
          <input
            type="password"
            name="password"
            value={inputs.password || ''}
            onChange={onInputChange}
            placeholder="请输入密码"
          />
          <span className="tip-text">{tips.error}</span>
          <Link to="/register" className="register-text pull-right">
            立即注册
          </Link>
          <button type="button" className="btn-submit" onClick={onSubmit}>
            {loading && <i className="fa fa-circle-o-notch fa-spin" />}
            <span>登录</span>
          </button>
        </div>
        <div className="side login-picture">
          <img src={imgSrc} alt="" />
        </div>
      </div>
    </Login>
  )
}