# 基座应用

入口除了核心通信,以及一些全局状态以外，不做任何事，降低主入口复杂度。

入口代码很简单，使用的乾坤 (qiankun)，微前端框架 。

## 学习乾坤

qiankun 是微前端实现库。 `single-spa` 进行大量封装加强。 基座应用 与 子应用。

子应用想要在基座中展示，需要在基座中注册：`registerMicroApps`，向基座注册应用。

qiankun 规定的三种生命周期，分别是：`bootstrap`、`mount`、 `unmount` 。

**生命周期**

```
/**
 * bootstrap 只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap。
 * 通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等。
 */
export async function bootstrap() { }

/**
 * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
 */
export async function mount(props) { }

/**
 * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
 */
export async function unmount(props) { }

/**
 * 可选生命周期钩子，仅使用 loadMicroApp 方式加载微应用时生效
 */
export async function update(props) { }
```

## 注入的应用

center: '/platform/apps_center/'，在 platform 中 `apps/platform/src/app.tsx`

app: '/platform/apps_app/' 在 rubik 项目里，`apps/rubik/ovine.config.js`

## 参考教程

1. https://juejin.cn/post/7010043293492838430
2. https://qiankun.umijs.org/zh/guide
3. https://qiankun.umijs.org/zh/cookbook 巨石前端应用
