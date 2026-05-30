<template>
  <div class="content">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">
        <el-icon><i-ep-MapLocation /></el-icon>
        物流追踪
      </h2>
      <p class="page-desc">通过区块链地址追踪运单的完整物流轨迹</p>
    </div>

    <el-card class="main-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <el-icon><i-ep-Search /></el-icon>
            <span>运单追踪</span>
          </div>
        </div>
      </template>

      <!-- 搜索区域 -->
      <div class="search-area">
        <el-input 
          v-model="searchAddress" 
          placeholder="请输入运单的区块链地址"
          class="search-input"
          clearable
          @keyup.enter="trackForm"
        >
          <template #prefix>
            <el-icon><i-ep-Link /></el-icon>
          </template>
        </el-input>
        <el-button type="primary" @click="trackForm" :loading="loading">
          <el-icon><i-ep-Search /></el-icon>
          追踪
        </el-button>
      </div>

      <!-- 追踪结果 -->
      <div v-if="formData" class="track-result">
        <!-- 基本信息 -->
        <div class="info-section">
          <h3 class="section-title">
            <el-icon><i-ep-Document /></el-icon>
            运单基本信息
          </h3>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="运单ID">{{ formData.id || '-' }}</el-descriptions-item>
            <el-descriptions-item label="状态">
              <el-tag :type="formData.status === 'on' ? 'success' : 'info'">
                {{ formData.status === 'on' ? '运输中' : '已完成' }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="发件人地址">{{ formData.senderAddr || '-' }}</el-descriptions-item>
            <el-descriptions-item label="发件人电话">{{ formData.senderContact || '-' }}</el-descriptions-item>
            <el-descriptions-item label="收件人地址">{{ formData.receiverAddr || '-' }}</el-descriptions-item>
            <el-descriptions-item label="收件人电话">{{ formData.receiverContact || '-' }}</el-descriptions-item>
            <el-descriptions-item label="物流公司" :span="2">{{ formData.logisticsCompanyName || '-' }}</el-descriptions-item>
          </el-descriptions>
        </div>

        <!-- 物流轨迹时间线 -->
        <div class="timeline-section">
          <h3 class="section-title">
            <el-icon><i-ep-Timer /></el-icon>
            物流轨迹 (区块链溯源)
          </h3>
          
          <el-timeline>
            <!-- 发货节点 -->
            <el-timeline-item
              :timestamp="formData.createdAt || ''"
              placement="top"
              type="success"
              :hollow="false"
              size="large"
            >
              <el-card class="timeline-card">
                <div class="timeline-content">
                  <div class="timeline-title">
                    <el-icon><i-ep-Box /></el-icon>
                    <span>运单创建 - 发货</span>
                  </div>
                  <div class="timeline-desc">
                    <p>发件人: {{ formData.senderAddr || '-' }}</p>
                    <p>物流公司: {{ formData.logisticsCompanyName || '-' }}</p>
                  </div>
                </div>
              </el-card>
            </el-timeline-item>

            <!-- 中转节点 -->
            <el-timeline-item
              v-for="(transit, index) in (formData.forms || [])"
              :key="index"
              :timestamp="transit.createdAt || ''"
              placement="top"
              type="primary"
              :hollow="false"
              size="large"
            >
              <el-card class="timeline-card">
                <div class="timeline-content">
                  <div class="timeline-title">
                    <el-icon><i-ep-Van /></el-icon>
                    <span>中转站点 #{{ index + 1 }}</span>
                  </div>
                  <div class="timeline-desc">
                    <p>中转方地址: {{ transit.transitAddr || '-' }}</p>
                    <p>中转地点: {{ transit.transitAddrInfo || '-' }}</p>
                    <p>联系电话: {{ transit.transitContact || '-' }}</p>
                  </div>
                  <div class="blockchain-info">
                    <el-tag size="small" type="info">
                      <el-icon><i-ep-Link /></el-icon>
                      区块链已记录
                    </el-tag>
                  </div>
                </div>
              </el-card>
            </el-timeline-item>

            <!-- 完成节点 -->
            <el-timeline-item
              v-if="formData.status === 'off'"
              timestamp="运单已完成"
              placement="top"
              type="success"
              :hollow="false"
              size="large"
            >
              <el-card class="timeline-card completed">
                <div class="timeline-content">
                  <div class="timeline-title">
                    <el-icon><i-ep-CircleCheck /></el-icon>
                    <span>已签收</span>
                  </div>
                  <div class="timeline-desc">
                    <p>收件人: {{ formData.receiverAddr || '-' }}</p>
                  </div>
                </div>
              </el-card>
            </el-timeline-item>

            <!-- 等待中节点 -->
            <el-timeline-item
              v-else
              timestamp="等待中..."
              placement="top"
              type="warning"
              :hollow="true"
              size="large"
            >
              <el-card class="timeline-card pending">
                <div class="timeline-content">
                  <div class="timeline-title">
                    <el-icon><i-ep-Loading /></el-icon>
                    <span>运输中</span>
                  </div>
                  <div class="timeline-desc">
                    <p>等待下一个中转站或签收</p>
                  </div>
                </div>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>

      <!-- 空状态 -->
      <el-empty v-else-if="searched && !formData" description="未找到该运单信息" />
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { ElMessage } from 'element-plus';
import { aesDecrypt } from '@/utils/utils';

let info = { address: '' };
try {
  const session = localStorage.getItem('userSession');
  if (session) {
    info = JSON.parse(aesDecrypt(session, 'xpxxy'));
  }
} catch (e) {
  console.error('解析用户信息失败:', e);
}

const searchAddress = ref('');
const loading = ref(false);
const formData = ref(null);
const searched = ref(false);

const trackForm = async () => {
  if (!searchAddress.value) {
    ElMessage.warning('请输入运单的区块链地址');
    return;
  }

  loading.value = true;
  searched.value = true;
  formData.value = null;

  try {
    const res = await axios.post('/api/searchForm', {
      searchData: searchAddress.value,
      userAddr: info.address || ''
    });

    if (res.data.code === '4000' && res.data.data) {
      // API返回的是数组，取第一个元素
      const data = Array.isArray(res.data.data) ? res.data.data[0] : res.data.data;
      formData.value = data;
      ElMessage.success('追踪成功');
    } else {
      ElMessage.info('未找到该运单');
    }
  } catch (error) {
    console.error(error);
    ElMessage.error('追踪失败');
  } finally {
    loading.value = false;
  }
};
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

.main-card {
  border-radius: 12px;
  border: none;
  
  :deep(.el-card__header) {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 12px 12px 0 0;
    padding: 16px 24px;
  }
  
  .card-header {
    .header-left {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #fff;
      font-size: 16px;
      font-weight: 500;
    }
  }
}

.search-area {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  
  .search-input {
    flex: 1;
  }
}

.track-result {
  .info-section {
    margin-bottom: 32px;
  }
  
  .section-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    font-weight: 600;
    color: #303133;
    margin: 0 0 16px 0;
    padding-left: 12px;
    border-left: 3px solid #667eea;
  }
}

.timeline-section {
  .el-timeline {
    padding-left: 20px;
  }
}

.timeline-card {
  border-radius: 10px;
  border: 1px solid #e8e8e8;
  
  &.completed {
    border-color: #67c23a;
    background: #f0f9eb;
  }
  
  &.pending {
    border-color: #e6a23c;
    background: #fdf6ec;
  }
  
  .timeline-content {
    .timeline-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 15px;
      font-weight: 600;
      color: #303133;
      margin-bottom: 12px;
      
      .el-icon {
        color: #667eea;
      }
    }
    
    .timeline-desc {
      p {
        margin: 6px 0;
        font-size: 13px;
        color: #606266;
      }
    }
    
    .blockchain-info {
      margin-top: 12px;
      
      .el-tag {
        display: inline-flex;
        align-items: center;
        gap: 4px;
      }
    }
  }
}
</style>
