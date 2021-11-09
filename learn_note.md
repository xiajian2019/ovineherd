# 熟悉笔记

表结构:

users: 用户表
files: 文件存储，提供诸如上传的文件之类的
authorizations: 授权
categories: 表存的是啥?
configurations: 配置?
products: 应该就是应用
relations: 没看到有数据
specifications: 没看到数据

## 用户

users 表中 存在 6 个多态扩展的字段：

```
`id` bigint(20) NOT NULL AUTO_INCREMENT,
`type` varchar(255) DEFAULT NULL,
`username` varchar(64) DEFAULT NULL,
`password` varchar(64) DEFAULT NULL,
`phone` varchar(64) DEFAULT NULL,
`email` varchar(64) DEFAULT NULL,
`relation1` varchar(255) NOT NULL DEFAULT '',
`relation2` varchar(255) NOT NULL DEFAULT '',
`relation3` varchar(255) NOT NULL DEFAULT '',
`relation4` varchar(255) NOT NULL DEFAULT '',
`relation5` varchar(255) NOT NULL DEFAULT '',
`relation6` varchar(255) NOT NULL DEFAULT '',
`relation1_type` varchar(64) NOT NULL DEFAULT '',
`relation2_type` varchar(64) NOT NULL DEFAULT '',
`relation3_type` varchar(64) NOT NULL DEFAULT '',
`relation4_type` varchar(64) NOT NULL DEFAULT '',
`relation5_type` varchar(64) NOT NULL DEFAULT '',
`relation6_type` varchar(64) NOT NULL DEFAULT '',
`created_time` timestamp NULL DEFAULT NULL,
`updated_time` timestamp NULL DEFAULT NULL,
```

采用的 id 为 bigint 可以通过 snowflake 雪花算法来生成 id，可以方便的做分布式。

目前看到的： relation6_type 的取值: config、category、product、 authorization、user。

## attributes - 看起来是字典表

属性数据:

```
`id` bigint(20) unsigned NOT NULL,
`source_id` bigint(20) unsigned NOT NULL COMMENT '目标id',
`type` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
`name` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '自定义字段',
`language` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'zh-CN' COMMENT '语言',
`remark` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '字段名备注',
`value` text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '字段',
`format` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '数据类型',
`created_time` timestamp NULL DEFAULT NULL,
`updated_time` timestamp NULL DEFAULT NULL,
```

表设计的很牛逼，所有的数据 id 都是 分布式无符号整数。

管理权限是通过 attributes 来实现的，数据通过 category 存放是啥?

## file 表

file 看起来没啥用，但是存在 `/v1/file` 这样的 API，这个接口好像是存在一些问题。数据不能保存。

## 组织

应用设置里存在 3 个配置项:

1. 展示设置
2. 环境变量
3. 接口设置

这些配置 都是写到 attributes 中 source_id 为 209745247423430656 的记录中。

attributes 的表设计，包含度了多种 name 类型的配置:

```
username
updated_time
title
sys_desc
side_visible
schema
resource
removable
relation4
relation3_type
relation3
relation2_type
relation2
relation1_type
relation1
real_name
phone
password
page_type
page_id
org_desc
operation
name
logo
limit_str
limit_raw
limit_data
leader
label
isolation
is_root
id
icon
entity
email
desc
created_time
avatar
app_home_page_id
```

这里有些能理解，有些不太能理解，整个设计思路是？可以尝试自己去熟悉一下。

## 产品 - 应用

products 产品表

```
`id` bigint(20) NOT NULL,
`type` varchar(255) DEFAULT NULL, 好像是区分页面类型的: ovine_app 和 ovine_app_page 这样的类型区分
`relation1` varchar(255) NOT NULL DEFAULT '',
`relation2` varchar(255) NOT NULL DEFAULT '',
`relation3` varchar(255) NOT NULL DEFAULT '',
`relation4` varchar(255) NOT NULL DEFAULT '',
`relation5` varchar(255) NOT NULL DEFAULT '',
`relation6` varchar(255) NOT NULL DEFAULT '',
`relation1_type` varchar(64) NOT NULL DEFAULT '',
`relation2_type` varchar(64) NOT NULL DEFAULT '',
`relation3_type` varchar(64) NOT NULL DEFAULT '',
`relation4_type` varchar(64) NOT NULL DEFAULT '',
`relation5_type` varchar(64) NOT NULL DEFAULT '',
`relation6_type` varchar(64) NOT NULL DEFAULT '',
`created_time` timestamp NULL DEFAULT NULL,
`updated_time` timestamp NULL DEFAULT NULL,
```

然后自带上其包含的 6 种关联设置，页面的数据是存放在 attributes 表里的，json 字符串存放在 value 里

从日志里学习，生成一个新的组织，居然建了这么多数据，其实组织本身是不需要的，并且没啥必要。

```
2021/08/10 21:33:46.614 [D] [server.go:2807]  |            ::1| 200 |  10.992297ms|   match| GET      /v1/category   r:/v1/category/
2021/08/10 21:34:00.252 [D] [server.go:2807]  |            ::1| 200 |       40.3µs| nomatch| OPTIONS  /v1/config
2021/08/10 21:34:00.253 [D] [configurations.go:20]
2021/08/10 21:34:00.253 [D] [configurations.go:42]  Post
2021/08/10 21:34:00.253 [D] [configurations.go:43]  fast
2021/08/10 21:34:00.253 [D] [configurations.go:50]  map[name:test005 sys_desc:test005 title:test005 type:ovine_org]
[ORM]2021/08/10 21:34:00  -[Queries/default] - [  OK /     db.Exec /    16.2ms] - [INSERT INTO `configurations` (`id`, `type`, `relation1`, `relation2`, `relation3`, `relation4`, `relation5`, `relation6`, `relation1_type`, `relation2_type`, `relation3_type`, `relation4_type`, `relation5_type`, `relation6_type`, `created_time`, `updated_time`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)] - `213047323930918912`, `ovine_org`, ``, ``, ``, ``, ``, ``, ``, ``, ``, ``, ``, ``, `2021-08-10 21:34:00.25393 +0800 CST`, `2021-08-10 21:34:00.25393 +0800 CST`
2021/08/10 21:34:00.270 [D] [attributes.go:52]  InsertAttributesToDb-data map[name:test005 sys_desc:test005 title:test005 type:ovine_org]
2021/08/10 21:34:00.270 [D] [common.go:147]  test005
string
[ORM]2021/08/10 21:34:00  -[Queries/default] - [  OK /     db.Exec /     6.0ms] - [INSERT INTO `attributes` (`id`, `source_id`,`type`, `name`, `language`, `remark`, `value`, `format`,  `created_time`, `updated_time`) VALUES (?, ?,?, ?, ?, ?, ?, ?, ?, ?);] - `213047324002222080`, `213047323930918912`, `configuration`, `name`, `zh_CN`, ``, `test005`, `string`, `2021-08-10 21:34:00`, `2021-08-10 21:34:00`
2021/08/10 21:34:00.276 [D] [common.go:147]  test005
string
[ORM]2021/08/10 21:34:00  -[Queries/default] - [  OK /     db.Exec /     1.3ms] - [INSERT INTO `attributes` (`id`, `source_id`,`type`, `name`, `language`, `remark`, `value`, `format`,  `created_time`, `updated_time`) VALUES (?, ?,?, ?, ?, ?, ?, ?, ?, ?);] - `213047324027387904`, `213047323930918912`, `configuration`, `sys_desc`, `zh_CN`, ``, `test005`, `string`, `2021-08-10 21:34:00`, `2021-08-10 21:34:00`
2021/08/10 21:34:00.277 [D] [common.go:147]  test005
string
[ORM]2021/08/10 21:34:00  -[Queries/default] - [  OK /     db.Exec /     1.7ms] - [INSERT INTO `attributes` (`id`, `source_id`,`type`, `name`, `language`, `remark`, `value`, `format`,  `created_time`, `updated_time`) VALUES (?, ?,?, ?, ?, ?, ?, ?, ?, ?);] - `213047324031582208`, `213047323930918912`, `configuration`, `title`, `zh_CN`, ``, `test005`, `string`, `2021-08-10 21:34:00`, `2021-08-10 21:34:00`
2021/08/10 21:34:00.279 [D] [common.go:147]  ovine_org
string
2021/08/10 21:34:00.279 [D] [attributes.go:61]  deleteMap-type
2021/08/10 21:34:00.279 [D] [server.go:2807]  |            ::1| 200 |  25.869052ms|   match| POST     /v1/config   r:/v1/config/
2021/08/10 21:34:00.284 [D] [server.go:2807]  |            ::1| 200 |     39.322µs| nomatch| OPTIONS  /v1/category
2021/08/10 21:34:00.285 [D] [categories.go:19]  URLMapping
2021/08/10 21:34:00.285 [D] [categories.go:20]
2021/08/10 21:34:00.285 [D] [categories.go:58]  Post
2021/08/10 21:34:00.285 [D] [common.go:147]  0
string
2021/08/10 21:34:00.285 [D] [common.go:147]  0
string
[ORM]2021/08/10 21:34:00  -[Queries/default] - [  OK /     db.Exec /     0.4ms] - [INSERT INTO `categories` (`id`, `parent_id`, `level`, `path`, `type`, `relation1`, `relation2`, `relation3`, `relation4`, `relation5`, `relation6`, `relation1_type`, `relation2_type`, `relation3_type`, `relation4_type`, `relation5_type`, `relation6_type`, `created_time`, `updated_time`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)] - `213047324065136640`, `0`, `0`, `0`, `ovine_org`, `213047323930918912`, ``, ``, ``, ``, ``, `config`, `user`, ``, ``, ``, ``, `2021-08-10 21:34:00.285347 +0800 CST`, `2021-08-10 21:34:00.285347 +0800 CST`
2021/08/10 21:34:00.285 [D] [attributes.go:52]  InsertAttributesToDb-data map[level:0 parent_id:0 path:0 relation1:213047323930918912 relation1_type:config relation2_type:user type:ovine_org]
[ORM]2021/08/10 21:34:00  -[Queries/default] - [  OK /     db.Exec /     0.4ms] - [INSERT INTO `categories` (`id`, `parent_id`, `level`, `path`, `type`, `relation1`, `relation2`, `relation3`, `relation4`, `relation5`, `relation6`, `relation1_type`, `relation2_type`, `relation3_type`, `relation4_type`, `relation5_type`, `relation6_type`, `created_time`, `updated_time`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)] - `213047324086108160`, `0`, `0`, `0`, `ovine_org_team`, `213047324065136640`, ``, ``, ``, ``, ``, `category`, ``, ``, ``, ``, ``, `2021-08-10 21:34:00.290936 +0800 CST`, `2021-08-10 21:34:00.290936 +0800 CST`
2021/08/10 21:34:00.291 [D] [attributes.go:52]  InsertAttributesToDb-data map[is_root:1 label:test005 level:0 parent_id:0 path:0 relation1:213047324065136640 relation1_type:category removable: type:ovine_org_team]
[ORM]2021/08/10 21:34:00  -[Queries/default] - [  OK /     db.Exec /     0.7ms] - [INSERT INTO `attributes` (`id`, `source_id`,`type`, `name`, `language`, `remark`, `value`, `format`,  `created_time`, `updated_time`) VALUES (?, ?,?, ?, ?, ?, ?, ?, ?, ?);] - `213047324090302464`, `213047324086108160`, `category`, `removable`, `zh_CN`, ``, ``, `string`, `2021-08-10 21:34:00`, `2021-08-10 21:34:00`
[ORM]2021/08/10 21:34:00  -[Queries/default] - [  OK /     db.Exec /     1.1ms] - [INSERT INTO `attributes` (`id`, `source_id`,`type`, `name`, `language`, `remark`, `value`, `format`,  `created_time`, `updated_time`) VALUES (?, ?,?, ?, ?, ?, ?, ?, ?, ?);] - `213047324094496768`, `213047324086108160`, `category`, `is_root`, `zh_CN`, ``, `1`, `string`, `2021-08-10 21:34:00`, `2021-08-10 21:34:00`
2021/08/10 21:34:00.293 [D] [common.go:147]  test005
string
[ORM]2021/08/10 21:34:00  -[Queries/default] - [  OK /     db.Exec /     4.7ms] - [INSERT INTO `attributes` (`id`, `source_id`,`type`, `name`, `language`, `remark`, `value`, `format`,  `created_time`, `updated_time`) VALUES (?, ?,?, ?, ?, ?, ?, ?, ?, ?);] - `213047324098691072`, `213047324086108160`, `category`, `label`, `zh_CN`, ``, `test005`, `string`, `2021-08-10 21:34:00`, `2021-08-10 21:34:00`
2021/08/10 21:34:00.298 [D] [server.go:2807]  |            ::1| 200 |   7.624777ms|   match| POST     /v1/category   r:/v1/category/
2021/08/10 21:34:00.304 [D] [server.go:2807]  |            ::1| 200 |     51.725µs| nomatch| OPTIONS  /v1/user
2021/08/10 21:34:00.305 [D] [users.go:18]
2021/08/10 21:34:00.305 [D] [users.go:142]  Post
2021/08/10 21:34:00.305 [D] [users.go:143]  fast
2021/08/10 21:34:00.305 [D] [users.go:150]  map[is_root:1 leader:1 password:test005 relation1_type:config relation2_type:category relation3:213047324086108160 relation3_type:category relation4_type:category type:ovine_org_user_213047324065136640 username:test005]
2021/08/10 21:34:00.305 [D] [users.go:153]  ovine_org_user_213047324065136640
2021/08/10 21:34:00.305 [D] [usersFast.go:62]  SnowflakeId - 使用的雪片 id
2021/08/10 21:34:00.305 [D] [usersFast.go:63]  213047324149022720
[ORM]2021/08/10 21:34:00  -[Queries/default] - [  OK /    db.Query /     0.2ms] - [select count(*) as count from  `users`  where username=? and type=?  limit 1] - `test005`, `ovine_org_user_213047324065136640`
[ORM]2021/08/10 21:34:00  -[Queries/default] - [  OK /     db.Exec /     0.4ms] - [INSERT INTO `users` (`id`, `type`, `username`, `password`, `phone`, `email`, `relation1`, `relation2`, `relation3`, `relation4`, `relation5`, `relation6`, `relation1_type`, `relation2_type`, `relation3_type`, `relation4_type`, `relation5_type`, `relation6_type`, `created_time`, `updated_time`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)] - `213047324149022720`, `ovine_org_user_213047324065136640`, `test005`, `test005`, ``, ``, ``, ``, `213047324086108160`, ``, ``, ``, `config`, `category`, `category`, `category`, ``, ``, `2021-08-10 21:34:00.30545 +0800 CST`, `2021-08-10 21:34:00.30545 +0800 CST`
2021/08/10 21:34:00.305 [D] [usersFast.go:144]  map[is_root:1 leader:1 password:test005 relation1_type:config relation2_type:category relation3:213047324086108160 relation3_type:category relation4_type:category type:ovine_org_user_213047324065136640 username:test005]
[ORM]2021/08/10 21:34:00  -[Queries/default] - [  OK /     db.Exec /     1.1ms] - [INSERT INTO `attributes` (`id`, `source_id`,`type`, `name`, `language`, `remark`, `value`, `format`,  `created_time`, `updated_time`) VALUES (?, ?,?, ?, ?, ?, ?, ?, ?, ?);] - `213047324149022720`, `213047324149022720`, `user`, `relation1_type`, ``, ``, `config`, `string`, `2021-08-10 21:34:00`, `2021-08-10 21:34:00`
[ORM]2021/08/10 21:34:00  -[Queries/default] - [  OK /     db.Exec /     0.3ms] - [INSERT INTO `attributes` (`id`, `source_id`,`type`, `name`, `language`, `remark`, `value`, `format`,  `created_time`, `updated_time`) VALUES (?, ?,?, ?, ?, ?, ?, ?, ?, ?);] - `213047324157411328`, `213047324149022720`, `user`, `relation2_type`, ``, ``, `category`, `string`, `2021-08-10 21:34:00`, `2021-08-10 21:34:00`
[ORM]2021/08/10 21:34:00  -[Queries/default] - [FAIL /     db.Exec /     0.1ms] - [INSERT INTO `attributes` (`id`, `source_id`,`type`, `name`, `language`, `remark`, `value`, `format`,  `created_time`, `updated_time`) VALUES (?, ?,?, ?, ?, ?, ?, ?, ?, ?);] - `213047324157411328`, `213047324149022720`, `user`, `leader`, ``, ``, `1`, `string`, `2021-08-10 21:34:00`, `2021-08-10 21:34:00` - Error 1062: Duplicate entry '213047324157411328' for key 'PRIMARY'
[ORM]2021/08/10 21:34:00  -[Queries/default] - [FAIL /     db.Exec /     0.2ms] - [INSERT INTO `attributes` (`id`, `source_id`,`type`, `name`, `language`, `remark`, `value`, `format`,  `created_time`, `updated_time`) VALUES (?, ?,?, ?, ?, ?, ?, ?, ?, ?);] - `213047324157411328`, `213047324149022720`, `user`, `relation3_type`, ``, ``, `category`, `string`, `2021-08-10 21:34:00`, `2021-08-10 21:34:00` - Error 1062: Duplicate entry '213047324157411328' for key 'PRIMARY'
[ORM]2021/08/10 21:34:00  -[Queries/default] - [FAIL /     db.Exec /     0.1ms] - [INSERT INTO `attributes` (`id`, `source_id`,`type`, `name`, `language`, `remark`, `value`, `format`,  `created_time`, `updated_time`) VALUES (?, ?,?, ?, ?, ?, ?, ?, ?, ?);] - `213047324157411328`, `213047324149022720`, `user`, `relation4_type`, ``, ``, `category`, `string`, `2021-08-10 21:34:00`, `2021-08-10 21:34:00` - Error 1062: Duplicate entry '213047324157411328' for key 'PRIMARY'
[ORM]2021/08/10 21:34:00  -[Queries/default] - [  OK /     db.Exec /     0.3ms] - [INSERT INTO `attributes` (`id`, `source_id`,`type`, `name`, `language`, `remark`, `value`, `format`,  `created_time`, `updated_time`) VALUES (?, ?,?, ?, ?, ?, ?, ?, ?, ?);] - `213047324161605632`, `213047324149022720`, `user`, `is_root`, ``, ``, `1`, `string`, `2021-08-10 21:34:00`, `2021-08-10 21:34:00`
[ORM]2021/08/10 21:34:00  -[Queries/default] - [FAIL /     db.Exec /     0.1ms] - [INSERT INTO `attributes` (`id`, `source_id`,`type`, `name`, `language`, `remark`, `value`, `format`,  `created_time`, `updated_time`) VALUES (?, ?,?, ?, ?, ?, ?, ?, ?, ?);] - `213047324161605632`, `213047324149022720`, `user`, `relation3`, ``, ``, `213047324086108160`, `string`, `2021-08-10 21:34:00`, `2021-08-10 21:34:00` - Error 1062: Duplicate entry '213047324161605632' for key 'PRIMARY'
2021/08/10 21:34:00.308 [D] [usersFast.go:190]  SnowflakeId2
2021/08/10 21:34:00.308 [D] [usersFast.go:191]  213047324149022720
[ORM]2021/08/10 21:34:00  -[Queries/default] - [  OK /     db.Exec /     1.2ms] - [INSERT INTO `categories` (`id`, `parent_id`, `level`, `path`, `type`, `relation1`, `relation2`, `relation3`, `relation4`, `relation5`, `relation6`, `relation1_type`, `relation2_type`, `relation3_type`, `relation4_type`, `relation5_type`, `relation6_type`, `created_time`, `updated_time`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)] - `213047324190965760`, `0`, `0`, `0`, `ovine_org_role`, `213047324065136640`, ``, ``, ``, ``, ``, `category`, `authorization`, ``, ``, ``, ``, `2021-08-10 21:34:00.315567 +0800 CST`, `2021-08-10 21:34:00.315567 +0800 CST`
2021/08/10 21:34:00.316 [D] [attributes.go:52]  InsertAttributesToDb-data map[desc:由系统自动创建，拥有该组织所有权限，请谨慎操作。 is_root:1 level:0 name:超级权限 parent_id:0 path:0 relation1:213047324065136640 relation1_type:category relation2_type:authorization type:ovine_org_role]
2021/08/10 21:34:00.316 [D] [common.go:147]  0
string
2021/08/10 21:34:00.316 [D] [attributes.go:61]  deleteMap-path
2021/08/10 21:34:00.316 [D] [common.go:147]  0
string
2021/08/10 21:34:00.316 [D] [attributes.go:61]  deleteMap-level
2021/08/10 21:34:00.316 [D] [common.go:147]  超级权限
string
[ORM]2021/08/10 21:34:00  -[Queries/default] - [  OK /     db.Exec /     1.2ms] - [INSERT INTO `attributes` (`id`, `source_id`,`type`, `name`, `language`, `remark`, `value`, `format`,  `created_time`, `updated_time`) VALUES (?, ?,?, ?, ?, ?, ?, ?, ?, ?);] - `213047324199354368`, `213047324190965760`, `category`, `name`, `zh_CN`, ``, `超级权限`, `string`, `2021-08-10 21:34:00`, `2021-08-10 21:34:00`
2021/08/10 21:34:00.318 [D] [common.go:147]  1
string
[ORM]2021/08/10 21:34:00  -[Queries/default] - [  OK /     db.Exec /     0.3ms] - [INSERT INTO `attributes` (`id`, `source_id`,`type`, `name`, `language`, `remark`, `value`, `format`,  `created_time`, `updated_time`) VALUES (?, ?,?, ?, ?, ?, ?, ?, ?, ?);] - `213047324203548672`, `213047324190965760`, `category`, `is_root`, `zh_CN`, ``, `1`, `string`, `2021-08-10 21:34:00`, `2021-08-10 21:34:00`
2021/08/10 21:34:00.318 [D] [common.go:147]  由系统自动创建，拥有该组织所有权限，请谨慎操作。
string
[ORM]2021/08/10 21:34:00  -[Queries/default] - [FAIL /     db.Exec /     0.1ms] - [INSERT INTO `attributes` (`id`, `source_id`,`type`, `name`, `language`, `remark`, `value`, `format`,  `created_time`, `updated_time`) VALUES (?, ?,?, ?, ?, ?, ?, ?, ?, ?);] - `213047324203548672`, `213047324190965760`, `category`, `desc`, `zh_CN`, ``, `由系统自动创建，拥有该组织所有权限，请谨慎操作。`, `string`, `2021-08-10 21:34:00`, `2021-08-10 21:34:00` - Error 1062: Duplicate entry '213047324203548672' for key 'PRIMARY'
2021/08/10 21:34:00.318 [D] [common.go:147]  ovine_org_role
string
2021/08/10 21:34:00.318 [D] [attributes.go:61]  deleteMap-type
2021/08/10 21:34:00.318 [D] [common.go:147]  category
string
2021/08/10 21:34:00.318 [D] [attributes.go:61]  deleteMap-relation1_type
2021/08/10 21:34:00.318 [D] [common.go:147]  authorization
string
2021/08/10 21:34:00.318 [D] [attributes.go:61]  deleteMap-relation2_type
2021/08/10 21:34:00.318 [D] [common.go:147]  0
string
2021/08/10 21:34:00.318 [D] [attributes.go:61]  deleteMap-parent_id
2021/08/10 21:34:00.318 [D] [common.go:147]  213047324065136640
string
2021/08/10 21:34:00.318 [D] [attributes.go:61]  deleteMap-relation1
2021/08/10 21:34:00.318 [D] [server.go:2807]  |            ::1| 200 |   3.528151ms|   match| POST     /v1/category   r:/v1/category/
2021/08/10 21:34:00.325 [D] [server.go:2807]  |            ::1| 200 |     54.256µs| nomatch| OPTIONS  /v1/user/213047324149022720
2021/08/10 21:34:00.326 [D] [users.go:18]
2021/08/10 21:34:00.326 [D] [users.go:188]  Put
2021/08/10 21:34:00.326 [D] [users.go:189]  fast
[ORM]2021/08/10 21:34:00  -[Queries/default] - [  OK / db.QueryRow /     0.2ms] - [SELECT `id`, `type`, `username`, `password`, `phone`, `email`, `relation1`, `relation2`, `relation3`, `relation4`, `relation5`, `relation6`, `relation1_type`, `relation2_type`, `relation3_type`, `relation4_type`, `relation5_type`, `relation6_type`, `created_time`, `updated_time` FROM `users` WHERE `id` = ? ] - `213047324149022720`
[ORM]2021/08/10 21:34:00  -[Queries/default] - [  OK /     db.Exec /     0.5ms] - [UPDATE `users` SET `id` = ?, `type` = ?, `username` = ?, `password` = ?, `phone` = ?, `email` = ?, `relation1` = ?, `relation2` = ?, `relation3` = ?, `relation4` = ?, `relation5` = ?, `relation6` = ?, `relation1_type` = ?, `relation2_type` = ?, `relation3_type` = ?, `relation4_type` = ?, `relation5_type` = ?, `relation6_type` = ?, `created_time` = ?, `updated_time` = ? WHERE `id` = ?] - `213047324149022720`, `ovine_org_user_213047324065136640`, `test005`, `test005`, ``, ``, ``, `213047324065136640`, `213047324086108160`, `213047324190965760`, ``, ``, `config`, `category`, `category`, `category`, ``, ``, `2021-08-10 13:34:00 +0800 CST`, `2021-08-10 21:34:00.326731 +0800 CST`, `213047324149022720`
[ORM]2021/08/10 21:34:00  -[Queries/default] - [  OK /    db.Query /     0.2ms] - [select * from  attributes where source_id=? and name=? and type=?] - `213047324149022720`, `id`, `user`
2021/08/10 21:34:00.327 [E] [attributes.go:162]  <nil>
2021/08/10 21:34:00.327 [D] [usersFast.go:523]  []
2021/08/10 21:34:00.327 [D] [usersFast.go:524]  not data in attributes
[ORM]2021/08/10 21:34:00  -[Queries/default] - [  OK /     db.Exec /     0.3ms] - [INSERT INTO `attributes` (`id`, `source_id`,`type`, `name`, `language`, `remark`, `value`, `format`,  `created_time`, `updated_time`) VALUES (?, ?,?, ?, ?, ?, ?, ?, ?, ?);] - `213047324241297408`, `213047324149022720`, `user`, `id`, ``, ``, `213047324149022720`, `string`, `2021-08-10 21:34:00`, `2021-08-10 21:34:00`
[ORM]2021/08/10 21:34:00  -[Queries/default] - [  OK /    db.Query /     0.2ms] - [select * from  attributes where source_id=? and name=? and type=?] - `213047324149022720`, `relation2`, `user`
2021/08/10 21:34:00.328 [E] [attributes.go:162]  <nil>
2021/08/10 21:34:00.328 [D] [usersFast.go:523]  []
2021/08/10 21:34:00.328 [D] [usersFast.go:524]  not data in attributes
[ORM]2021/08/10 21:34:00  -[Queries/default] - [  OK /     db.Exec /     0.3ms] - [INSERT INTO `attributes` (`id`, `source_id`,`type`, `name`, `language`, `remark`, `value`, `format`,  `created_time`, `updated_time`) VALUES (?, ?,?, ?, ?, ?, ?, ?, ?, ?);] - `213047324245491712`, `213047324149022720`, `user`, `relation2`, ``, ``, `213047324065136640`, `string`, `2021-08-10 21:34:00`, `2021-08-10 21:34:00`
[ORM]2021/08/10 21:34:00  -[Queries/default] - [  OK /    db.Query /     0.3ms] - [select * from  attributes where source_id=? and name=? and type=?] - `213047324149022720`, `relation4`, `user`
2021/08/10 21:34:00.347 [E] [attributes.go:162]  <nil>
2021/08/10 21:34:00.347 [D] [usersFast.go:523]  []
2021/08/10 21:34:00.347 [D] [usersFast.go:524]  not data in attributes
[ORM]2021/08/10 21:34:00  -[Queries/default] - [  OK /     db.Exec /     0.5ms] - [INSERT INTO `attributes` (`id`, `source_id`,`type`, `name`, `language`, `remark`, `value`, `format`,  `created_time`, `updated_time`) VALUES (?, ?,?, ?, ?, ?, ?, ?, ?, ?);] - `213047324325183488`, `213047324149022720`, `user`, `relation4`, ``, ``, `213047324190965760`, `string`, `2021-08-10 21:34:00`, `2021-08-10 21:34:00`
[ORM]2021/08/10 21:34:00  -[Queries/default] - [  OK /    db.Query /     0.2ms] - [select * from  attributes where source_id=? and name=? and type=?] - `213047324149022720`, `desc`, `user`
2021/08/10 21:34:00.348 [E] [attributes.go:162]  <nil>
2021/08/10 21:34:00.348 [D] [usersFast.go:523]  []
2021/08/10 21:34:00.348 [D] [usersFast.go:524]  not data in attributes
[ORM]2021/08/10 21:34:00  -[Queries/default] - [  OK /     db.Exec /     1.5ms] - [INSERT INTO `attributes` (`id`, `source_id`,`type`, `name`, `language`, `remark`, `value`, `format`,  `created_time`, `updated_time`) VALUES (?, ?,?, ?, ?, ?, ?, ?, ?, ?);] - `213047324329377792`, `213047324149022720`, `user`, `desc`, ``, ``, `本组织超级管理员`, `string`, `2021-08-10 21:34:00`, `2021-08-10 21:34:00`
2021/08/10 21:34:00.350 [D] [server.go:2807]  |            ::1| 200 |   23.73258ms|   match| PUT      /v1/user/213047324149022720   r:/v1/user/:id
2021/08/10 21:34:00.356 [D] [server.go:2807]  |            ::1| 200 |     38.004µs| nomatch| OPTIONS  /v1/category/213047324065136640
2021/08/10 21:34:00.356 [D] [categories.go:19]  URLMapping
2021/08/10 21:34:00.356 [D] [categories.go:20]
2021/08/10 21:34:00.356 [D] [categories.go:321]  Put
2021/08/10 21:34:00.356 [D] [categories.go:322]  Put
2021/08/10 21:34:00.357 [D] [categories.go:323]  fast
2021/08/10 21:34:00.357 [D] [categories.go:329]  c.Ctx.Input.RequestBody
2021/08/10 21:34:00.357 [D] [categories.go:330]  [123 34 105 100 34 58 34 50 49 51 48 52 55 51 50 52 48 54 53 49 51 54 54 52 48 34 44 34 114 101 108 97 116 105 111 110 50 34 58 34 50 49 51 48 52 55 51 50 52 49 52 57 48 50 50 55 50 48 34 125]
[ORM]2021/08/10 21:34:00  -[Queries/default] - [  OK / db.QueryRow /     0.3ms] - [SELECT `id`, `parent_id`, `level`, `path`, `type`, `relation1`, `relation2`, `relation3`, `relation4`, `relation5`, `relation6`, `relation1_type`, `relation2_type`, `relation3_type`, `relation4_type`, `relation5_type`, `relation6_type`, `created_time`, `updated_time` FROM `categories` WHERE `id` = ? ] - `213047324065136640`
[ORM]2021/08/10 21:34:00  -[Queries/default] - [  OK /     db.Exec /     3.5ms] - [UPDATE `categories` SET `id` = ?, `parent_id` = ?, `level` = ?, `path` = ?, `type` = ?, `relation1` = ?, `relation2` = ?, `relation3` = ?, `relation4` = ?, `relation5` = ?, `relation6` = ?, `relation1_type` = ?, `relation2_type` = ?, `relation3_type` = ?, `relation4_type` = ?, `relation5_type` = ?, `relation6_type` = ?, `created_time` = ?, `updated_time` = ? WHERE `id` = ?] - `213047324065136640`, `0`, `0`, `0`, `ovine_org`, `213047323930918912`, `213047324149022720`, ``, ``, ``, ``, `config`, `user`, ``, ``, ``, ``, `2021-08-10 13:34:00 +0800 CST`, `2021-08-10 21:34:00.357519 +0800 CST`, `213047324065136640`
2021/08/10 21:34:00.361 [D] [attributes.go:96]  UpdateAttributesToDb-data map[id:213047324065136640 relation2:213047324149022720]
2021/08/10 21:34:00.361 [D] [common.go:147]  213047324065136640
string
[ORM]2021/08/10 21:34:00  -[Queries/default] - [  OK /    db.Query /     0.2ms] - [select * from  attributes where source_id=? and name=? and type=?] - `213047324065136640`, `id`, `category`
2021/08/10 21:34:00.361 [E] [attributes.go:162]  <nil>
2021/08/10 21:34:00.361 [D] [attributes.go:109]  []
2021/08/10 21:34:00.361 [D] [attributes.go:110]  not data in attributes
[ORM]2021/08/10 21:34:00  -[Queries/default] - [  OK /     db.Exec /     0.4ms] - [INSERT INTO `attributes` (`id`, `source_id`,`type`, `name`, `language`, `remark`, `value`, `format`,  `created_time`, `updated_time`) VALUES (?, ?,?, ?, ?, ?, ?, ?, ?, ?);] - `213047324383903744`, `213047324065136640`, `category`, `id`, `zh_CN`, ``, `213047324065136640`, `string`, `2021-08-10 21:34:00`, `2021-08-10 21:34:00`
2021/08/10 21:34:00.362 [D] [common.go:147]  213047324149022720
string
[ORM]2021/08/10 21:34:00  -[Queries/default] - [  OK /    db.Query /     0.2ms] - [select * from  attributes where source_id=? and name=? and type=?] - `213047324065136640`, `relation2`, `category`
2021/08/10 21:34:00.362 [E] [attributes.go:162]  <nil>
2021/08/10 21:34:00.362 [D] [attributes.go:109]  []
2021/08/10 21:34:00.362 [D] [attributes.go:110]  not data in attributes
[ORM]2021/08/10 21:34:00  -[Queries/default] - [  OK /     db.Exec /     1.3ms] - [INSERT INTO `attributes` (`id`, `source_id`,`type`, `name`, `language`, `remark`, `value`, `format`,  `created_time`, `updated_time`) VALUES (?, ?,?, ?, ?, ?, ?, ?, ?, ?);] - `213047324388098048`, `213047324065136640`, `category`, `relation2`, `zh_CN`, ``, `213047324149022720`, `string`, `2021-08-10 21:34:00`, `2021-08-10 21:34:00`
2021/08/10 21:34:00.363 [D] [server.go:2807]  |            ::1| 200 |   7.056362ms|   match| PUT      /v1/category/213047324065136640   r:/v1/category/:id
```
