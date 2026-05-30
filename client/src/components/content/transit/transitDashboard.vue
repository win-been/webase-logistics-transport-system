<template>
  <div class="content">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">
        <el-icon><i-ep-DataAnalysis /></el-icon>
        数据概览
      </h2>
      <p class="page-desc">查看运单统计数据和业务概况</p>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <div class="stat-card" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
          <div class="stat-icon">
            <el-icon><i-ep-Document /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.totalForms }}</div>
            <div class="stat-label">运单总数</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card" style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);">
          <div class="stat-icon">
            <el-icon><i-ep-CircleCheck /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.activeForms }}</div>
            <div class="stat-label">进行中</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card" style="background: linear-gradient(135deg, #fc4a1a 0%, #f7b733 100%);">
          <div class="stat-icon">
            <el-icon><i-ep-Finished /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.completedForms }}</div>
            <div class="stat-label">已完成</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card" style="background: linear-gradient(135deg, #4776E6 0%, #8E54E9 100%);">
          <div class="stat-icon">
            <el-icon><i-ep-TrendCharts /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.transitCount }}</div>
            <div class="stat-label">中转次数</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <!-- 最近运单 -->
      <el-col :span="16">
        <el-card class="main-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <div class="header-left">
                <el-icon><i-ep-List /></el-icon>
                <span>最近运单</span>
              </div>
              <el-button type="primary" link @click="$router.push('/transit/transitformlist')">
                查看全部 <el-icon><i-ep-ArrowRight /></el-icon>
              </el-button>
            </div>
          </template>
          
          <el-table :data="recentForms" style="width: 100%" :max-height="300">
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="logisticsInfoAddr" label="区块链地址" show-overflow-tooltip />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="row.status === 'on' ? 'success' : 'info'" size="small">
                  {{ row.status === 'on' ? '进行中' : '已完成' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createdAt" label="创建时间" width="180" />
          </el-table>
        </el-card>
      </el-col>

      <!-- 快捷操作 -->
      <el-col :span="8">
        <el-card class="main-card quick-actions" shadow="hover">
          <template #header>
            <div class="card-header">
              <div class="header-left">
                <el-icon><i-ep-Operation /></el-icon>
                <span>快捷操作</span>
              </div>
            </div>
          </template>
          
          <div class="action-list">
            <div class="action-item" @click="$router.push('/transit/transitcreateform')">
              <el-icon class="action-icon" style="background: #667eea;"><i-ep-Plus /></el-icon>
              <span>创建运单</span>
            </div>
            <div class="action-item" @click="$router.push('/transit/transitsearchform')">
              <el-icon class="action-icon" style="background: #11998e;"><i-ep-Search /></el-icon>
              <span>查询运单</span>
            </div>
            <div class="action-item" @click="$router.push('/transit/transitformtrack')">
              <el-icon class="action-icon" style="background: #fc4a1a;"><i-ep-MapLocation /></el-icon>
              <span>物流追踪</span>
            </div>
            <div class="action-item" @click="$router.push('/transit/transituserlist')">
              <el-icon class="action-icon" style="background: #4776E6;"><i-ep-User /></el-icon>
              <span>用户通讯录</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios';
import { aesDecrypt } from '@/utils/utils';

const info = JSON.parse(aesDecrypt(localStorage.getItem('userSession'), 'xpxxy'));

const stats = reactive({
  totalForms: 0,
  activeForms: 0,
  completedForms: 0,
  transitCount: 0
});

const recentForms = ref([]);

const fetchStats = async () => {
  try {
    // 获取我创建的运单
    const res = await axios.post('/api/getTransitForm', { address: info.address });
    if (res.data.code === '2000') {
      const forms = res.data.data || [];
      stats.totalForms = forms.length;
      stats.activeForms = forms.filter(f => f.status === 'on').length;
      stats.completedForms = forms.filter(f => f.status === 'off').length;
      
      // 计算中转次数
      let transitTotal = 0;
      forms.forEach(f => {
        transitTotal += (f.forms?.length || 0);
      });
      stats.transitCount = transitTotal;
      
      // 最近5条运单
      recentForms.value = forms.slice(0, 5);
    }
  } catch (error) {
    console.error('获取统计数据失败', error);
  }
};

onMounted(() => {
  fetchStats();
});
</script>

<style scoped lang="less">
.content {
  padding: 24px;
}

.page-header {
  margin-bottom: 24px;
  
  .page-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 24px;
    font-weight: 600;
    color: #303133;
    margin: 0 0 8px 0;
    
    .el-icon {
      color: #667eea;
    }
  }
  
  .page-desc {
    color: #909399;
    font-size: 14px;
    margin: 0;
  }
}

.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  border-radius: 12px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  color: #fff;
  
  .stat-icon {
    width: 56px;
    height: 56px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .el-icon {
      font-size: 28px;
    }
  }
  
  .stat-info {
    .stat-value {
      font-size: 32px;
      font-weight: 700;
      line-height: 1;
    }
    
    .stat-label {
      font-size: 14px;
      opacity: 0.9;
      margin-top: 6px;
    }
  }
}

.main-card {
  border-radius: 12px;
  border: none;
  margin-bottom: 20px;
  
  :deep(.el-card__header) {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 12px 12px 0 0;
    padding: 16px 24px;
  }
  
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    .header-left {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #fff;
      font-size: 16px;
      font-weight: 500;
    }
    
    .el-button {
      color: #fff;
    }
  }
}

.quick-actions {
  .action-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .action-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    background: #f8f9fa;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s;
    
    &:hover {
      background: #f0f5ff;
      transform: translateX(4px);
    }
    
    .action-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 20px;
    }
    
    span {
      font-size: 15px;
      font-weight: 500;
      color: #303133;
    }
  }
}
</style>

