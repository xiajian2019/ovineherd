### Ovine Herd

可在线构建管理系统应用的平台，前端使用乾坤(qikun) 构建

#### 启动项目

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

###### 注意:

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

#### 访问路由

目前了解下来，是现需要 先创建一个平台用户， 然后 使用这个平台用户，创建一个组织，然后，用这个组织再来建一个可以设计页面的账号（设计页面的账号是 通过权限进行关联的）

- `http://localhost:7060/platform/center/sys/admin` 平台用户登录，可以通过创建测试账号来实现

组织账号登录地址： http://localhost:7060/platform/center/org/209734481693638656/login?username=test

其中: 209734481693638656 机构的信息是存在 configurations 表中的。

#### 服务端部分

`server/uniadmin/` 采用 beego 构建的后端 API。

- [文档地址](http://doc.uniappadmin.cn/docs/baser_service/explain)
- [源代码仓库](https://gitee.com/uniappadmin/uniappadmin)

- 修改 `/server/uniadmin/conf/app.conf` 配置信息
- 执行 `/server/uniadmin/conf/uniappadmin.sql` 初始化数据库
- 按照 `uniappadmin` 文档启动项目
