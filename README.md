# Ovine Herd

可在线构建管理系统应用的平台，前端使用乾坤 (qikun) 构建

> qiankun - https://github.com/umijs/qiankun ，用来构建微前端框架的。将不同的技术栈的项目放到一起。

## 启动项目

> 前端部分启动

需要提前安装好 `node-sass`

- `yarn install` 安装本项目依赖
- `yarn all:install` 安装子应用依赖，由于网络问题，全部安装，极其容易出错，当某个子应用安装出错，可以只对某一个重新安装就行，不需要每次都重复执行这一个命令

- `yarn all:gen` 生成子应用静态文件，生成的文件在 `.ovine/` 中缺乏 static 目录
- `yarn all:start` 启动所有项目

> 后端项目启动:

> `npm run start:server:uniadmin` 通过 go run main.go 将后端页面启动起来

项目熟悉:

platform - 主要是平台相关的页面
rubik - 主要是应用 和 编辑器相关的

### platform

从项目的代码来看，包含了如下的页面:

1. login 登录部分，有理由怀疑登录部分使用的是同一个登录界面
2. org 组织： 组织是用来设计和关联具体的应用的
3. sys 系统管理： 用来管理组织的
4. register 注册：如果改造的话，需要将其干掉

请求的接口都是放在了 `api/resource.ts` 这个文件中，具体的映射 API 端点都在 `utils.ts` 这个文件中。

### rubik

从项目代码来看，主要有如下的页面:

1. `system/admin`
2. `system/login`
3. `system/role`
4. `system/self`
5. `system/user`
6. `system/welcome`

### 注意:

由于本地使用了 `localhost:7049` 作为 API 接口，如果想使用测试服 API，可以将对应配置注释

- `apps/platform/src/core/env.ts` 中 `localhost.domains.api` 注释
- `apps/rubik/src/core/env.ts` 中 `localhost.domains.api` 注释

比如:

```javascript
// 本地开发
  localhost: {
    domains: {
      // api: 'http://localhost:7049', // 注释此行，即可使用测试服API，原因是默认就是测试服务器的 API
    },
  }
```

## 访问路由

目前了解下来，是现需要 先创建一个平台用户， 然后 使用这个平台用户，创建一个组织，然后，用这个组织再来建一个可以设计页面的账号（设计页面的账号是 通过权限进行关联的）

- `http://localhost:7060/platform/center/sys/admin` 平台用户登录，可以通过创建测试账号来实现

组织账号登录地址： http://localhost:7060/platform/center/org/209734481693638656/login?username=test

其中: 209734481693638656 机构的信息是存在 configurations 表中的，这么长的 ID 是 通过 `go-snowflake` 的工具包生成的。

username 居然是通过 `query_string` 传过来的。

## 服务端部分

`server/uniadmin/` 采用 beego 构建的后端 API。beego 构建的服务端就比较的简单

- [文档地址](http://doc.uniappadmin.cn/docs/baser_service/explain)
- [源代码仓库](https://gitee.com/uniappadmin/uniappadmin)

- 修改 `/server/uniadmin/conf/app.conf` 配置信息
- 执行 `/server/uniadmin/conf/uniappadmin.sql` 初始化数据库
- 按照 `uniappadmin` 文档启动项目

### Docker

增加 docker 的方式进行部署的方式。尝试改造成云原生的项目。

结合 `go-vue-admin` 取长补短。