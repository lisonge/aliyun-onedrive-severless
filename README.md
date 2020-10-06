<!--
 * @Date: 2020-10-04 17:24:47
 * @LastEditors: lisonge
 * @Author: lisonge
 * @LastEditTime: 2020-10-06 16:37:08
-->

# aliyun-onedrive-severless

阿里云函数版 ondrive-index **后端代理访问**

使用 github actions 一键部署

## 准备

### Aliyun

在[此页面](https://account.console.aliyun.com/#/secure)获取**accountId**

在[此页面](https://ram.console.aliyun.com/users)创建用户

随意填写登录名及显示名，勾选编程访问，点击创建

此时获得此用户的**accessKeyId**和**accessKeySecret**

另外需要对此用户添加权限[AliyunFCFullAccess, AliyunOSSFullAccess]

### Onderive

**refresh_token** 在[此界面](https://dev.songe.li/aliyun-onedrive-severless/graph-auth-pages/index.html)获取该授权令牌

## 部署

首先 Fork 本项目, 在新项目的 Action 界面有两种部署方式

下面将要输入的信息对应如下, 以下操作在 Fork 的新项目界面进行

| Name                     | Value           |
| ------------------------ | --------------- |
| ALIYUN_ACCOUNT_ID        | accountId       |
| ALIYUN_ACCESS_KEY_ID     | accessKeyId     |
| ALIYUN_ACCESS_KEY_SECRET | accessKeySecret |
| ONEDRIVE_REFRESH_TOKEN   | refresh_token   |

### 通过单次输入

进入[Actions deloy-by-inputs](./actions?query=workflow%3Adeloy-by-inputs), 点击右侧**Run workflow**输入对应信息

### 通过 Secrets

进入项目[Secrets](./settings/secrets/new)界面添加你之前获得的信息

进入[Actions deloy-by-secrets](./actions?query=workflow%3Adeloy-by-secrets), 点击右侧**Run workflow**运行此项目

## 其他

该项目默认部署在香港, 可在/config.toml 更改部署区域, 区域对应节点名在[ali-oss#data-regions](https://github.com/ali-sdk/ali-oss#data-regions)查看, 但不建议更改部署区域

可在[此处](https://account.live.com/consent/Manage)取消应用名称为**aliyun-onedrive-severless**的授权, 之前的一切令牌都会失效

本项目还有许多不足的地方, 欢迎[issue](./issues)和[pull](./pulls)
