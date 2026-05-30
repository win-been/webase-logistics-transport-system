<template>
  <div class="admin-home">
    <!-- 欢迎横幅 -->
    <div class="welcome-banner">
      <div class="banner-content">
        <div class="banner-text">
          <h1>欢迎使用区块链物流表单系统</h1>
          <p>基于 FISCO BCOS 区块链技术，实现物流信息的可信存证与全流程追溯</p>
        </div>
        <div class="banner-icon">
          <el-icon><i-ep-Box /></el-icon>
        </div>
      </div>
    </div>

    <!-- 数据统计 -->
    <div class="section-title">
      <el-icon><i-ep-DataAnalysis /></el-icon>
      <span>数据概览</span>
    </div>
    <div class="stats-cards">
      <div class="stats-card">
        <div class="stats-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
          <el-icon><i-ep-Document /></el-icon>
        </div>
        <div class="stats-info">
          <span class="stats-value">{{ stats.formCount }}</span>
          <span class="stats-label">运单总数</span>
        </div>
      </div>
      <div class="stats-card">
        <div class="stats-icon" style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);">
          <el-icon><i-ep-Box /></el-icon>
        </div>
        <div class="stats-info">
          <span class="stats-value">{{ stats.productCount }}</span>
          <span class="stats-label">商品总数</span>
        </div>
      </div>
      <div class="stats-card">
        <div class="stats-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
          <el-icon><i-ep-User /></el-icon>
        </div>
        <div class="stats-info">
          <span class="stats-value">{{ stats.userCount }}</span>
          <span class="stats-label">用户总数</span>
        </div>
      </div>
      <div class="stats-card">
        <div class="stats-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
          <el-icon><i-ep-TrendCharts /></el-icon>
        </div>
        <div class="stats-info">
          <span class="stats-value">{{ stats.activeCount }}</span>
          <span class="stats-label">进行中运单</span>
        </div>
      </div>
    </div>

    <!-- 快捷功能卡片 -->
    <div class="section-title">
      <el-icon><i-ep-Grid /></el-icon>
      <span>快捷功能</span>
    </div>
    <div class="quick-cards">
      <div class="quick-card" @click="$router.push('/admin/admincreateform')">
        <div class="card-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
          <el-icon><i-ep-Edit /></el-icon>
        </div>
        <div class="card-info">
          <h3>创建运单</h3>
          <p>新建物流运单，记录发货信息</p>
        </div>
        <el-icon class="card-arrow"><i-ep-ArrowRight /></el-icon>
      </div>

      <div class="quick-card" @click="$router.push('/admin/admincreateproduct')">
        <div class="card-icon" style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);">
          <el-icon><i-ep-Plus /></el-icon>
        </div>
        <div class="card-info">
          <h3>商品入库</h3>
          <p>添加新商品信息到系统</p>
        </div>
        <el-icon class="card-arrow"><i-ep-ArrowRight /></el-icon>
      </div>

      <div class="quick-card" @click="$router.push('/admin/adminallformlist')">
        <div class="card-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
          <el-icon><i-ep-List /></el-icon>
        </div>
        <div class="card-info">
          <h3>运单管理</h3>
          <p>查看和管理所有运单</p>
        </div>
        <el-icon class="card-arrow"><i-ep-ArrowRight /></el-icon>
      </div>

      <div class="quick-card" @click="$router.push('/admin/adminallproducts')">
        <div class="card-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
          <el-icon><i-ep-Box /></el-icon>
        </div>
        <div class="card-info">
          <h3>商品管理</h3>
          <p>浏览和管理商品列表</p>
        </div>
        <el-icon class="card-arrow"><i-ep-ArrowRight /></el-icon>
      </div>

      <div class="quick-card" @click="$router.push('/admin/adminsearchform')">
        <div class="card-icon" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);">
          <el-icon><i-ep-Search /></el-icon>
        </div>
        <div class="card-info">
          <h3>运单查询</h3>
          <p>搜索和追踪运单状态</p>
        </div>
        <el-icon class="card-arrow"><i-ep-ArrowRight /></el-icon>
      </div>

      <div class="quick-card" @click="$router.push('/admin/adminmanage')">
        <div class="card-icon" style="background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);">
          <el-icon><i-ep-User /></el-icon>
        </div>
        <div class="card-info">
          <h3>用户管理</h3>
          <p>管理系统用户账户</p>
        </div>
        <el-icon class="card-arrow"><i-ep-ArrowRight /></el-icon>
      </div>
    </div>

    <!-- 系统介绍 -->
    <div class="section-title">
      <el-icon><i-ep-InfoFilled /></el-icon>
      <span>系统介绍</span>
    </div>
    <div class="intro-section">
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="intro-card">
            <div class="intro-icon">
              <el-icon><i-ep-Link /></el-icon>
            </div>
            <h3>区块链存证</h3>
            <p>基于 FISCO BCOS 联盟链，所有物流数据上链存储，确保数据不可篡改、永久可追溯。</p>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="intro-card">
            <div class="intro-icon">
              <el-icon><i-ep-Position /></el-icon>
            </div>
            <h3>全程追溯</h3>
            <p>物流运单从创建到签收全流程记录，支持多节点中转，实现完整的物流轨迹追踪。</p>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="intro-card">
            <div class="intro-icon">
              <el-icon><i-ep-Goods /></el-icon>
            </div>
            <h3>商品管理</h3>
            <p>商品信息链上存证，支持条码查询，确保商品来源可信、信息透明。</p>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 技术栈 -->
    <div class="section-title">
      <el-icon><i-ep-Cpu /></el-icon>
      <span>技术架构</span>
    </div>
    <div class="tech-section">
      <div class="tech-item">
        <el-tag type="primary" size="large">Vue 3</el-tag>
      </div>
      <div class="tech-item">
        <el-tag type="primary" size="large">Vite</el-tag>
      </div>
      <div class="tech-item">
        <el-tag type="success" size="large">Element Plus</el-tag>
      </div>
      <div class="tech-item">
        <el-tag type="warning" size="large">Node.js</el-tag>
      </div>
      <div class="tech-item">
        <el-tag type="warning" size="large">Express</el-tag>
      </div>
      <div class="tech-item">
        <el-tag type="danger" size="large">FISCO BCOS</el-tag>
      </div>
      <div class="tech-item">
        <el-tag type="danger" size="large">WeBase</el-tag>
      </div>
      <div class="tech-item">
        <el-tag type="info" size="large">MySQL</el-tag>
      </div>
      <div class="tech-item">
        <el-tag size="large">Sequelize</el-tag>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from "vue";
import axios from "axios";

const stats = reactive({
  formCount: 0,
  productCount: 0,
  userCount: 0,
  activeCount: 0,
});

// 获取统计数据
const fetchStats = async () => {
  try {
    // 获取运单数量 (POST请求)
    const formRes = await axios.post("/api/getAllForm");
    if (formRes.data && formRes.data.data) {
      stats.formCount = formRes.data.data.length;
      stats.activeCount = formRes.data.data.filter(f => f.status === 'on').length;
    }
    
    // 获取商品数量
    const productRes = await axios.get("/api/findAllGoods");
    if (productRes.data && productRes.data.data) {
      stats.productCount = productRes.data.data.length;
    }
    
    // 获取用户数量
    const userRes = await axios.get("/api/getAllUser");
    if (userRes.data && userRes.data.data) {
      stats.userCount = userRes.data.data.length;
    }
  } catch (err) {
    console.log("获取统计数据失败", err);
  }
};

onMounted(() => {
  fetchStats();
});
</script>

<style scoped lang="less">
.admin-home {
  padding: 20px;
  min-height: calc(100vh - 90px);
  box-sizing: border-box;
}

.welcome-banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 40px;
  margin-bottom: 30px;
  box-shadow: 0 10px 40px rgba(102, 126, 234, 0.3);
}

.banner-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.banner-text {
  h1 {
    color: #fff;
    font-size: 28px;
    margin: 0 0 12px 0;
    font-weight: 700;
  }
  
  p {
    color: rgba(255, 255, 255, 0.85);
    font-size: 16px;
    margin: 0;
  }
}

.banner-icon {
  .el-icon {
    font-size: 80px;
    color: rgba(255, 255, 255, 0.3);
  }
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 20px;
  padding-left: 10px;
  border-left: 4px solid #667eea;
  
  .el-icon {
    font-size: 20px;
    color: #667eea;
  }
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.stats-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  }
}

.stats-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .el-icon {
    font-size: 28px;
    color: #fff;
  }
}

.stats-info {
  display: flex;
  flex-direction: column;
  
  .stats-value {
    font-size: 32px;
    font-weight: 700;
    color: #303133;
    line-height: 1.2;
  }
  
  .stats-label {
    font-size: 14px;
    color: #909399;
    margin-top: 4px;
  }
}

.quick-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.quick-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
  }
}

.card-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  .el-icon {
    font-size: 28px;
    color: #fff;
  }
}

.card-info {
  flex: 1;
  
  h3 {
    margin: 0 0 6px 0;
    font-size: 16px;
    color: #303133;
    font-weight: 600;
  }
  
  p {
    margin: 0;
    font-size: 13px;
    color: #909399;
  }
}

.card-arrow {
  color: #c0c4cc;
  font-size: 18px;
}

.intro-section {
  margin-bottom: 30px;
}

.intro-card {
  background: #fff;
  border-radius: 12px;
  padding: 30px;
  text-align: center;
  height: 100%;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
  }
}

.intro-icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  
  .el-icon {
    font-size: 32px;
    color: #fff;
  }
}

.intro-card h3 {
  font-size: 18px;
  color: #303133;
  margin: 0 0 12px 0;
  font-weight: 600;
}

.intro-card p {
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
  margin: 0;
}

.tech-section {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.tech-item {
  :deep(.el-tag) {
    padding: 8px 16px;
    font-size: 14px;
  }
}
</style>


