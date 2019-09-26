/*
Navicat MySQL Data Transfer

Source Server         : 127.0.0.1
Source Server Version : 80012
Source Host           : localhost:3306
Source Database       : test_shop

Target Server Type    : MYSQL
Target Server Version : 80012
File Encoding         : 65001

Date: 2019-09-26 18:08:35
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for sys_permission
-- ----------------------------
DROP TABLE IF EXISTS `sys_permission`;
CREATE TABLE `sys_permission` (
  `id` int(32) NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `parentId` varchar(32) DEFAULT NULL COMMENT '父id',
  `name` varchar(100) DEFAULT NULL COMMENT '菜单标题',
  `url` varchar(255) DEFAULT NULL COMMENT '路径',
  `component` varchar(255) DEFAULT NULL COMMENT '组件',
  `componentName` varchar(100) DEFAULT NULL COMMENT '组件名字',
  `redirect` varchar(255) DEFAULT NULL COMMENT '一级菜单跳转地址',
  `menuType` int(11) DEFAULT NULL COMMENT '菜单类型(0:一级菜单; 1:子菜单:2:按钮权限)',
  `perms` varchar(255) DEFAULT NULL COMMENT '菜单权限编码',
  `permsType` varchar(10) DEFAULT '0' COMMENT '权限策略1显示2禁用',
  `sortNo` int(10) DEFAULT NULL COMMENT '菜单排序',
  `alwaysShow` tinyint(1) DEFAULT NULL COMMENT '聚合子路由: 1是0否',
  `icon` varchar(100) DEFAULT NULL COMMENT '菜单图标',
  `isRoute` tinyint(1) DEFAULT '1' COMMENT '是否路由菜单: 0:不是  1:是（默认值1）',
  `isLeaf` tinyint(1) DEFAULT NULL COMMENT '是否叶子节点:    1:是   0:不是',
  `hidden` int(2) DEFAULT '0' COMMENT '是否隐藏路由: 0否,1是',
  `description` varchar(255) DEFAULT NULL COMMENT '描述',
  `createBy` varchar(32) DEFAULT NULL COMMENT '创建人',
  `createTime` datetime DEFAULT NULL COMMENT '创建时间',
  `updateBy` varchar(32) DEFAULT NULL COMMENT '更新人',
  `updateTime` datetime DEFAULT NULL COMMENT '更新时间',
  `delFlag` int(1) DEFAULT '0' COMMENT '删除状态 0正常 1已删除',
  `ruleFlag` int(3) DEFAULT '0' COMMENT '是否添加数据权限1是0否',
  `status` varchar(2) DEFAULT NULL COMMENT '按钮权限状态(0无效1有效)',
  PRIMARY KEY (`id`),
  KEY `indexPremPid` (`parentId`) USING BTREE,
  KEY `indexPremIsRoute` (`isRoute`) USING BTREE,
  KEY `indexPremIsLeaf` (`isLeaf`) USING BTREE,
  KEY `indexPremSortNo` (`sortNo`) USING BTREE,
  KEY `indexPremDelFlag` (`delFlag`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='菜单权限表';

-- ----------------------------
-- Table structure for sys_role
-- ----------------------------
DROP TABLE IF EXISTS `sys_role`;
CREATE TABLE `sys_role` (
  `id` int(32) NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `roleName` varchar(200) DEFAULT NULL COMMENT '角色名称',
  `roleCode` varchar(100) NOT NULL COMMENT '角色编码',
  `description` varchar(255) DEFAULT NULL COMMENT '描述',
  `createBy` varchar(32) DEFAULT NULL COMMENT '创建人',
  `createTime` datetime DEFAULT NULL COMMENT '创建时间',
  `updateBy` varchar(32) DEFAULT NULL COMMENT '更新人',
  `updateTime` datetime DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `indexRoleCode` (`roleCode`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='角色表';

-- ----------------------------
-- Table structure for sys_role_permission
-- ----------------------------
DROP TABLE IF EXISTS `sys_role_permission`;
CREATE TABLE `sys_role_permission` (
  `id` int(32) NOT NULL AUTO_INCREMENT,
  `roleId` varchar(32) DEFAULT NULL COMMENT '角色id',
  `permissionId` varchar(32) DEFAULT NULL COMMENT '权限id',
  `dataRuleIds` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `indexGroupRolePerId` (`roleId`,`permissionId`) USING BTREE,
  KEY `indexGroupRoleId` (`roleId`) USING BTREE,
  KEY `indexGroupPerId` (`permissionId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='角色权限表';

-- ----------------------------
-- Table structure for sys_user
-- ----------------------------
DROP TABLE IF EXISTS `sys_user`;
CREATE TABLE `sys_user` (
  `id` int(32) NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `userName` varchar(100) DEFAULT NULL COMMENT '登录账号',
  `realName` varchar(100) DEFAULT NULL COMMENT '真实姓名',
  `password` varchar(255) DEFAULT NULL COMMENT '密码',
  `salt` varchar(45) DEFAULT NULL COMMENT 'md5密码盐',
  `avatar` varchar(255) DEFAULT NULL COMMENT '头像',
  `birthday` datetime DEFAULT NULL COMMENT '生日',
  `sex` int(11) DEFAULT NULL COMMENT '性别（1：男 2：女）',
  `email` varchar(45) DEFAULT NULL COMMENT '电子邮件',
  `phone` varchar(45) DEFAULT NULL COMMENT '电话',
  `orgCode` varchar(100) DEFAULT NULL COMMENT '部门code',
  `status` int(2) DEFAULT NULL COMMENT '状态(1：正常  2：冻结 ）',
  `delFlag` varchar(1) DEFAULT NULL COMMENT '删除状态（0，正常，1已删除）',
  `activitiSync` varchar(6) DEFAULT NULL COMMENT '同步工作流引擎1同步0不同步',
  `createBy` varchar(32) DEFAULT NULL COMMENT '创建人',
  `createTime` datetime DEFAULT NULL COMMENT '创建时间',
  `updateBy` varchar(32) DEFAULT NULL COMMENT '更新人',
  `updateTime` datetime DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `indexUserName` (`userName`) USING BTREE,
  KEY `indexUserStatus` (`status`) USING BTREE,
  KEY `indexUserDelFlag` (`delFlag`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COMMENT='用户表';

-- ----------------------------
-- Table structure for sys_user_role
-- ----------------------------
DROP TABLE IF EXISTS `sys_user_role`;
CREATE TABLE `sys_user_role` (
  `id` int(32) NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `userId` varchar(32) DEFAULT NULL COMMENT '用户id',
  `roleId` varchar(32) DEFAULT NULL COMMENT '角色id',
  PRIMARY KEY (`id`),
  KEY `index2GroupuuUserId` (`userId`) USING BTREE,
  KEY `index2GroupuuOleId` (`roleId`) USING BTREE,
  KEY `index2GroupuuUseridandroleid` (`userId`,`roleId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户角色表';

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `userId` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `unionId` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '微信 union ID',
  `openId` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '微信open ID',
  `gender` int(11) NOT NULL DEFAULT '0' COMMENT '性别 0->未知 1->男 2->女',
  `password` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '登录密码',
  `userName` varchar(60) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '用户名',
  `userAccount` varchar(60) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '用户账号',
  `userAvatar` varchar(300) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '用户头像',
  `userEmail` varchar(60) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '用户邮箱',
  `userMobile` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '用户手机号',
  PRIMARY KEY (`userId`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
