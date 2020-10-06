<!--
 * @Date: 2020-10-04 17:24:47
 * @LastEditors: lisonge
 * @Author: lisonge
 * @LastEditTime: 2020-10-06 15:52:19
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

Fork 本项目, 在新项目/settings/secrets/new 界面添加之前获得的信息

| Name                     | Value           |
| ------------------------ | --------------- |
| ALIYUN_ACCOUNT_ID        | accountId       |
| ALIYUN_ACCESS_KEY_ID     | accessKeyId     |
| ALIYUN_ACCESS_KEY_SECRET | accessKeySecret |
| ONEDRIVE_REFRESH_TOKEN   | refresh_token   |

在项目 actions 界面运行名称为**deloy-push.yml**的构建脚本

或者在名称为**deloy-manual.yml**的构建脚本的运行界面直接输入获得的信息然后运行

## 其他

该项目默认部署在香港, 可在/config.toml 更改部署区域, 区域对应节点名在[此界面](https://github.com/ali-sdk/ali-oss#data-regions)查看

可在[此处](https://account.live.com/consent/Manage)取消应用名称为**aliyun-onedrive-severless**的授权, 之前的一切令牌都会失效
