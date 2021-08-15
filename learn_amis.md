# amis

学习 amis

默认 amis 在解析模板字符串时，如果单纯的想要使用 $，需要使用 `\\$` 这样的转义做法。

当变量字段过多的时候，你需要一一映射配置，也许有点麻烦，所以可以使用"&"标识符，来展开所配置变量。

变量取值,支持从全局变量里取值,目前存在三种全局名称空间:

- window 即全局变量
- ls 即 localStorage， 如果值是 json 对象，可以直接当对象用比如：${ls:xxxxxlocalStrorageKey.xxxx}
- ss 即 sessionStorage，同上。

## 过滤器

存在很多过滤器:

- html
- raw
- json
- toJson
- toInt
- toFloat
- date
- now
- dateModify: 上个月第一天: `${_|now|dateModify:subtract:1:month|dateModify:startOf:month|date:YYYY-MM-DD HH\\:mm\\:ss}`
- number
- trim
- percent 百分比， percent:2 默认小数点 0 位。
- round
- truncate
- url_encode
- url_decode
- default
- split - split[:delimiter]
- join - join[:glue] glue 表示分隔符。
- sortBy - sortBy:key:method:dir ，例子: ${list|sortBy:value:numerical:desc}
- topAndOther: topAndOther:10:name:Others
- unique
- first
- last
- nth 选择第几个值
- pick - 获取对象或数组中符合条件的筛选值
- objectToArray
- plus
- minus
- sum
- abs
- duration
- bytes
- asArray
- lowerCase
- upperCase
- base64Encode
- base64Decode
- isTrue
- isFalse
- motMatch
- isMatch
- isEquals
- notEquals
- map
- filter

还可以自定义过滤器。

## 表达式：

在 amis 的实现过程中，当正则匹配到某个组件存在 xxxOn 语法的属性名时，会尝试进行下面步骤（以上面配置为例）：

- 提取 visibleOn 配置项配置的 JavaScript 语句 this.show === 1，并以当前组件的数据域为这段代码的数据作用域，执行这段 js 代码；
- 之后将执行结果赋值给 visible 并添加到组件属性中

这里是组件实现的细节。

disabledOn 和 visibleOn 中，通过表达式来构建控制显示隐藏。

## 联动

通过初始化标签：

所有初始化接口链接上使用数据映射获取参数的形式时，例如下面的 query=${query}，在当前数据域中，所引用的变量值（即 query）发生变化时，自动重新请求该接口。

发送指定数据

target 属性支持通过配置参数来发送指定数据，例如："target" :"xxx?a=${a}&b=${b}"，这样就会把当前数据域中的 a 变量和 b 变量发送给目标组件

## 行为

页面交互，视作为页面的行为:

amis 中，行为是和行为按钮组件绑定的。配置行为组件:

1. 添加行为按钮组件
2. 配置行为类型 ( actionType )
3. 根据行为类型，配置属性

```
{
  "type": "page",
  "body": { // type 为 action，actionType 为 ajax 这样的
    "type": "action",
    "label": "发出一个请求",
    "actionType": "ajax",
    "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm"
  }
}
```

样式主要是采用的 bootstrap，组件是通过 `className` 来设置的。 

## API 

请求似乎对 

接口返回格式（重要），所有配置在 amis 组件中的接口，都要符合下面的返回格式

```
{
  "status": 0,
  "msg": "",
  "data": {
    ...其他字段
  }
}
```

学习如何使用动态页面