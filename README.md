<!--
 * @Date: 2020-10-04 17:24:47
 * @LastEditors: lisonge
 * @Author: lisonge
 * @LastEditTime: 2020-10-07 13:37:11
-->

# aliyun-onedrive-severless 该项目正在升级,以更简单规范的方式去实现

阿里云函数版 ondrive-index **后端代理访问**

使用 github actions 一键部署

## 准备

### Aliyun

<details>

<summary>accountId</summary>

在[账号管理-安全设置](https://account.console.aliyun.com/#/secure) 账号 ID 在头像右侧第二行文字

</details>

<details>

<summary>accessKeyId accessKeySecret</summary>

方式 1: 在[RAM 访问控制 - AccessKey 管理](https://ram.console.aliyun.com/manage/ak) 创建 AccessKey

方式 2: 在[RAM 访问控制 - 用户](https://ram.console.aliyun.com/users/new) 创建子用户, 随意填写登录名及显示名，勾选编程访问，点击创建, 添加权限[AliyunFCFullAccess, AliyunOSSFullAccess]

</details>

### Onedrive

<details>
<summary>refresh_token</summary>

在[graph-auth-pages](https://dev.songe.li/aliyun-onedrive-severless/graph-auth-pages/index.html)获取授权令牌

</details>

## 部署

首先 Fork 本项目, 在新项目的 Action 界面有两种部署方式, 以下操作在 Fork 的新项目界面进行

### 通过 Inputs

进入[Actions deloy-by-inputs](../../actions?query=workflow%3Adeloy-by-inputs), 点击右侧**Run workflow**输入对应信息

| 输入名                   | 输入值          |
| ------------------------ | --------------- |
| ALIYUN_ACCOUNT_ID        | accountId       |
| ALIYUN_ACCESS_KEY_ID     | accessKeyId     |
| ALIYUN_ACCESS_KEY_SECRET | accessKeySecret |
| ONEDRIVE_REFRESH_TOKEN   | refresh_token   |

然后点击右侧**Run workflow**可部署此项目

### 通过 Secrets

进入项目[Secrets](../../settings/secrets/new)界面添加你之前获得的信息

| 添加名                   | 添加值          |
| ------------------------ | --------------- |
| ALIYUN_ACCOUNT_ID        | accountId       |
| ALIYUN_ACCESS_KEY_ID     | accessKeyId     |
| ALIYUN_ACCESS_KEY_SECRET | accessKeySecret |
| ONEDRIVE_REFRESH_TOKEN   | refresh_token   |

进入[Actions deloy-by-secrets](../../actions?query=workflow%3Adeloy-by-secrets), 点击右侧**Run workflow**可部署此项目

如果按照默认区域部署, 云函数链接在[函数计算控制台](https://fc.console.aliyun.com/fc/service/cn-hongkong/aliyun-severless-b395ab/function/onedrive-severless/overview)

## 前端

本项目仅为**后端**代理访问, 可在[config.toml](./config.toml)设置允许访问的 API

[在 Microsoft Graph 中使用文件](https://docs.microsoft.com/zh-cn/graph/api/resources/onedrive) 可获取所有 API

测试原始 API: [Graph 浏览器](https://developer.microsoft.com/zh-cn/graph/graph-explorer) 可以发出请求并查看 Microsoft Graph 的响应

## 其他

该项目默认部署在香港, 可在[config.toml](./config.toml) 更改部署区域, 区域对应节点名在[ali-oss#data-regions](https://github.com/ali-sdk/ali-oss#data-regions)查看, 但**不建议**更改部署区域

可在[你已授予访问权限的应用和服务](https://account.live.com/consent/Manage)取消应用名称为**onedrive-severless-b73c4cc**的授权, 之前的一切令牌都会失效

欢迎[issue](../../issues)和[pull](../../pulls)
