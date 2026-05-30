<template>
  <div class="home-container">
    <!-- 顶部导航栏 -->
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      :ellipsis="false"
    >
      <el-menu-item index="0">
        <img
          style="width: 60px"
          src="../assets/logo.png"
          alt="Delivery logo"
        />
        <div class="mainTitle">区块链物流表单系统</div>
      </el-menu-item>
      
      <div class="flex-grow" />
      
      <el-menu-item index="1" class="active-menu">
        <el-icon>
          <i-ep-Box />
        </el-icon>
        服务中心
      </el-menu-item>
      <el-menu-item index="2" @click="toUser">
        <el-icon>
          <i-ep-user />
        </el-icon>
        个人中心
      </el-menu-item>
    </el-menu>

    <!-- 主体内容区域 -->
    <div class="main-content">
      <!-- Hero区域 -->
      <div class="hero-section">
        <h1>区块链物流表单系统</h1>
        <p>基于区块链技术的物流信息溯源平台，确保物流数据安全、透明、不可篡改</p>
        <div class="hero-buttons">
          <el-button type="primary" size="large" @click="toLogin">立即登录</el-button>
          <el-button size="large" @click="toRegister">注册账号</el-button>
        </div>
      </div>

      <!-- 功能特点 -->
      <div class="features-section">
        <h2>平台特点</h2>
        <el-row :gutter="30">
          <el-col :span="6">
            <el-card shadow="hover" class="feature-card">
              <el-icon class="feature-icon"><i-ep-Lock /></el-icon>
              <h3>数据安全</h3>
              <p>采用区块链技术，数据一旦上链无法篡改，确保物流信息真实可靠</p>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover" class="feature-card">
              <el-icon class="feature-icon"><i-ep-Search /></el-icon>
              <h3>全程溯源</h3>
              <p>支持物流全流程追踪，从发货到收货每个环节都可追溯查询</p>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover" class="feature-card">
              <el-icon class="feature-icon"><i-ep-Connection /></el-icon>
              <h3>多方协作</h3>
              <p>支持发货方、中转方、收货方多角色协同，信息实时同步</p>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover" class="feature-card">
              <el-icon class="feature-icon"><i-ep-Goods /></el-icon>
              <h3>商品管理</h3>
              <p>完善的商品信息管理，支持商品入库、查询、关联物流单</p>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <!-- 快速入口 -->
      <div class="quick-access">
        <h2>快速入口</h2>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-card shadow="hover" class="access-card" @click="toLogin">
              <el-icon class="access-icon"><i-ep-User /></el-icon>
              <h3>普通用户</h3>
              <p>查询物流信息、追踪包裹状态</p>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" class="access-card" @click="toAdminLogin">
              <el-icon class="access-icon"><i-ep-Setting /></el-icon>
              <h3>管理员</h3>
              <p>管理物流表单、商品入库、用户管理</p>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" class="access-card" @click="toLogin">
              <el-icon class="access-icon"><i-ep-Van /></el-icon>
              <h3>中转方</h3>
              <p>更新物流中转信息、确认收发货</p>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <!-- 页脚 -->
      <div class="footer">
        <p>© 2024 区块链物流表单系统 - 基于 FISCO BCOS 区块链平台</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router';

const activeIndex = ref('1')
const router = useRouter()

function toService(){
  router.push('/')
}

function toUser(){
  router.push('/login')
}

function toLogin(){
  router.push('/login')
}

function toRegister(){
  router.push('/register')
}

function toAdminLogin(){
  router.push('/adminlogin')
}
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
}

.el-menu-demo {
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border-bottom: none !important;
}

.flex-grow {
  flex-grow: 1;
}

.mainTitle {
  font-size: 20px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.active-menu {
  color: #667eea !important;
}

.main-content {
  padding: 0 80px;
  max-width: 1400px;
  margin: 0 auto;
}

.hero-section {
  text-align: center;
  padding: 100px 20px 80px;
  color: white;
}

.hero-section h1 {
  font-size: 52px;
  margin-bottom: 24px;
  font-weight: 700;
  background: linear-gradient(135deg, #fff 0%, #e0e0e0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-section p {
  font-size: 18px;
  margin-bottom: 48px;
  color: rgba(255, 255, 255, 0.7);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.8;
}

.hero-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.hero-buttons .el-button--primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  padding: 12px 32px;
  font-size: 16px;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
}

.hero-buttons .el-button--default {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #fff;
  padding: 12px 32px;
  font-size: 16px;
  border-radius: 8px;
}

.hero-buttons .el-button--default:hover {
  background: rgba(255, 255, 255, 0.2);
}

.features-section {
  background: rgba(255, 255, 255, 0.98);
  border-radius: 24px;
  padding: 60px;
  margin: 40px 0;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.features-section h2 {
  text-align: center;
  font-size: 32px;
  margin-bottom: 48px;
  color: #1a1a2e;
  font-weight: 700;
}

.feature-card {
  text-align: center;
  padding: 32px 24px;
  height: 100%;
  transition: all 0.3s ease;
  border-radius: 16px;
  border: none;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  font-size: 52px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 24px;
}

.feature-card h3 {
  font-size: 20px;
  margin-bottom: 16px;
  color: #1a1a2e;
  font-weight: 600;
}

.feature-card p {
  color: #606266;
  line-height: 1.7;
  font-size: 14px;
}

.quick-access {
  background: rgba(255, 255, 255, 0.98);
  border-radius: 24px;
  padding: 60px;
  margin: 40px 0;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.quick-access h2 {
  text-align: center;
  font-size: 32px;
  margin-bottom: 48px;
  color: #1a1a2e;
  font-weight: 700;
}

.access-card {
  text-align: center;
  padding: 48px 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 16px;
  border: none;
}

.access-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 24px 48px rgba(102, 126, 234, 0.2);
}

.access-icon {
  font-size: 56px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 24px;
}

.access-card h3 {
  font-size: 22px;
  margin-bottom: 12px;
  color: #1a1a2e;
  font-weight: 600;
}

.access-card p {
  color: #606266;
  font-size: 14px;
}

.footer {
  text-align: center;
  padding: 40px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
}
</style>

