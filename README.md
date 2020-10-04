<!--
 * @Date: 2020-10-04 17:24:47
 * @LastEditors: lisonge
 * @Author: lisonge
 * @LastEditTime: 2020-10-04 17:59:05
-->

# aliyun-onedrive-severless

阿里云函数版 ondrive-index **后端**

使用 github actions 部署

## 准备

### 阿里云

**accountId** [获取账号 ID](https://account.console.aliyun.com/#/secure)

在[此界面](https://ram.console.aliyun.com/users)创建用户

登录名及显示名瞎填，勾选编程访问，点击创建

此时获得此用户的**accessKeyId**和**accessKeySecret**

对此用户添加权限[AliyunFCFullAccess, AliyunOSSFullAccess]

### Onderive

**refresh_token** 在[此界面](https://dev.songe.li/)获取, 获取界面未做好

## 部署

Fork 本项目, 在新项目/settings/secrets/new 界面添加之前获得的信息

| Name                     | Value           |
| ------------------------ | --------------- |
| ALIYUN_ACCOUNT_ID        | accountId       |
| ALIYUN_ACCESS_KEY_ID     | accessKeyId     |
| ALIYUN_ACCESS_KEY_SECRET | accessKeySecret |
| ONEDRIVE_REFRESH_TOKEN   | refresh_token   |
