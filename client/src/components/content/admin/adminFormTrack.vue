<template>
  <div class="content">
    <!-- 顶部搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-header">
        <div class="search-title">
          <el-icon class="title-icon"><i-ep-MapLocation /></el-icon>
          <span>运单追踪</span>
        </div>
        <el-text type="info">输入运单ID或区块链地址，查看物流轨迹</el-text>
      </div>
      <div class="search-form">
        <el-row :gutter="16">
          <el-col :span="6">
            <el-select v-model="searchType" placeholder="搜索类型" style="width: 100%;">
              <el-option label="运单ID" value="id" />
              <el-option label="区块链地址" value="address" />
            </el-select>
          </el-col>
          <el-col :span="12">
            <el-input 
              v-model="searchValue" 
              :placeholder="searchType === 'id' ? '请输入运单ID' : '请输入区块链地址（0x...）'"
              clearable
              @keyup.enter="searchTrack"
            >
              <template #prefix>
                <el-icon><i-ep-Search /></el-icon>
              </template>
            </el-input>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" @click="searchTrack" :loading="loading">
              <el-icon><i-ep-Position /></el-icon>
              追踪运单
            </el-button>
            <el-button @click="resetSearch">
              <el-icon><i-ep-Refresh /></el-icon>
              重置
            </el-button>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <!-- 运单列表选择 -->
    <el-card class="list-card" shadow="never" v-if="!selectedForm">
      <template #header>
        <div class="card-header">
          <span>选择要追踪的运单</span>
          <el-tag type="info">共 {{ formList.length }} 条运单</el-tag>
        </div>
      </template>
      <el-table :data="paginatedData" v-loading="loading" stripe @row-click="selectForm" style="cursor: pointer;">
        <el-table-column prop="id" label="运单ID" width="80" />
        <el-table-column prop="logisticsCompanyName" label="物流公司" width="120">
          <template #default="{ row }">
            {{ row.logisticsCompanyName || '未指定' }}
          </template>
        </el-table-column>
        <el-table-column prop="senderAddressInfo" label="发货地址" show-overflow-tooltip />
        <el-table-column prop="receiverAddressInfo" label="收货地址" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'on' ? 'success' : 'info'" size="small">
              {{ row.status === 'on' ? '运输中' : '已完成' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="100">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click.stop="selectForm(row)">
              追踪
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="formList.length"
        :page-size="pageSize"
        :current-page="currentPage"
        @current-change="handlePageChange"
        style="margin-top: 16px; justify-content: center;"
      />
    </el-card>

    <!-- 追踪详情 -->
    <div class="track-detail" v-if="selectedForm">
      <el-button class="back-btn" @click="selectedForm = null">
        <el-icon><i-ep-ArrowLeft /></el-icon>
        返回列表
      </el-button>

      <el-row :gutter="20">
        <!-- 左侧：运单信息 -->
        <el-col :span="8">
          <el-card class="info-card" shadow="never">
            <template #header>
              <div class="info-header">
                <el-icon><i-ep-Document /></el-icon>
                <span>运单信息</span>
              </div>
            </template>
            <div class="info-item">
              <span class="label">运单ID</span>
              <span class="value">#{{ selectedForm.id }}</span>
            </div>
            <div class="info-item">
              <span class="label">状态</span>
              <el-tag :type="selectedForm.status === 'on' ? 'success' : 'info'" size="small">
                {{ selectedForm.status === 'on' ? '运输中' : '已完成' }}
              </el-tag>
            </div>
            <div class="info-item">
              <span class="label">创建时间</span>
              <span class="value">{{ selectedForm.createdAt }}</span>
            </div>
            <el-divider />
            <div class="info-item">
              <span class="label">发货地址</span>
              <span class="value address">{{ selectedForm.senderAddressInfo }}</span>
            </div>
            <div class="info-item">
              <span class="label">收货地址</span>
              <span class="value address">{{ selectedForm.receiverAddressInfo }}</span>
            </div>
            <el-divider />
            <div class="info-item">
              <span class="label">发件人</span>
              <span class="value">{{ selectedForm.senderContact }}</span>
            </div>
            <div class="info-item">
              <span class="label">收件人</span>
              <span class="value">{{ selectedForm.receiverContact }}</span>
            </div>
          </el-card>

          <!-- 商品信息 -->
          <el-card class="info-card" shadow="never" style="margin-top: 16px;" v-if="selectedForm.good">
            <template #header>
              <div class="info-header">
                <el-icon><i-ep-Box /></el-icon>
                <span>商品信息</span>
              </div>
            </template>
            <div class="info-item">
              <span class="label">商品名称</span>
              <span class="value">{{ selectedForm.good.name || '暂无' }}</span>
            </div>
            <div class="info-item">
              <span class="label">商品类型</span>
              <span class="value">{{ selectedForm.good.productType || '暂无' }}</span>
            </div>
            <div class="info-item">
              <span class="label">生产日期</span>
              <span class="value">{{ selectedForm.good.productionDate || '暂无' }}</span>
            </div>
            <div class="info-item">
              <span class="label">保质期至</span>
              <span class="value">{{ selectedForm.good.expirationDate || '暂无' }}</span>
            </div>
          </el-card>
        </el-col>

        <!-- 右侧：物流轨迹 -->
        <el-col :span="16">
          <el-card class="timeline-card" shadow="never">
            <template #header>
              <div class="timeline-header">
                <div class="header-left">
                  <el-icon><i-ep-Position /></el-icon>
                  <span>物流轨迹</span>
                </div>
                <el-tag type="success" effect="plain">
                  共 {{ trackNodes.length }} 个节点
                </el-tag>
              </div>
            </template>

            <!-- 轨迹可视化 -->
            <div class="track-visual">
              <div class="track-line">
                <div 
                  v-for="(node, index) in trackNodes" 
                  :key="index" 
                  class="track-node"
                  :class="{ 'active': index === trackNodes.length - 1, 'completed': index < trackNodes.length - 1 }"
                >
                  <div class="node-dot">
                    <el-icon v-if="index === 0"><i-ep-Van /></el-icon>
                    <el-icon v-else-if="index === trackNodes.length - 1"><i-ep-LocationFilled /></el-icon>
                    <el-icon v-else><i-ep-CircleCheck /></el-icon>
                  </div>
                  <div class="node-info">
                    <div class="node-title">{{ node.title }}</div>
                    <div class="node-address">{{ node.address }}</div>
                    <div class="node-time">{{ node.time }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 详细时间线 -->
            <el-divider>详细记录</el-divider>
            <el-timeline>
              <el-timeline-item
                v-for="(node, index) in trackNodes"
                :key="index"
                :type="index === trackNodes.length - 1 ? 'primary' : 'success'"
                :hollow="index !== trackNodes.length - 1"
                :timestamp="node.time"
                placement="top"
              >
                <el-card shadow="never" class="timeline-content">
                  <div class="timeline-title">{{ node.title }}</div>
                  <div class="timeline-desc">
                    <el-icon><i-ep-Location /></el-icon>
                    {{ node.address }}
                  </div>
                  <div class="timeline-contact" v-if="node.contact">
                    <el-icon><i-ep-Phone /></el-icon>
                    {{ node.contact }}
                  </div>
                  <div class="timeline-blockchain" v-if="node.blockchainAddr">
                    <el-icon><i-ep-Link /></el-icon>
                    <el-text type="info" size="small">{{ node.blockchainAddr }}</el-text>
                  </div>
                </el-card>
              </el-timeline-item>
            </el-timeline>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { aesDecrypt } from '@/utils/utils';
import axios from 'axios';

const info = JSON.parse(
  aesDecrypt(localStorage.getItem("userSession"), "xpxxy")
);

const loading = ref(false);
const searchType = ref('id');
const searchValue = ref('');
const formList = ref([]);
const selectedForm = ref(null);
const currentPage = ref(1);
const pageSize = ref(6);

// 分页数据
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return formList.value.slice(start, end);
});

// 物流轨迹节点
const trackNodes = computed(() => {
  if (!selectedForm.value) return [];
  
  const nodes = [];
  
  // 发货节点
  nodes.push({
    title: '已发货',
    address: selectedForm.value.senderAddressInfo || '发货地址',
    time: selectedForm.value.createdAt,
    contact: selectedForm.value.senderContact,
    blockchainAddr: selectedForm.value.senderAddr
  });
  
  // 中转节点
  if (selectedForm.value.forms && selectedForm.value.forms.length > 0) {
    selectedForm.value.forms.forEach((form, index) => {
      nodes.push({
        title: `中转站 ${index + 1}`,
        address: form.transitAddrInfo || '中转地址',
        time: form.createdAt,
        contact: form.transitContact,
        blockchainAddr: form.transitAddr
      });
    });
  }
  
  // 如果已完成，添加签收节点
  if (selectedForm.value.status === 'off') {
    nodes.push({
      title: '已签收',
      address: selectedForm.value.receiverAddressInfo || '收货地址',
      time: '已完成',
      contact: selectedForm.value.receiverContact,
      blockchainAddr: selectedForm.value.receiverAddr
    });
  }
  
  return nodes;
});

// 加载所有运单
const fetchFormList = async () => {
  loading.value = true;
  try {
    const res = await axios.post('/api/getAllForm');
    if (res.data.code === '4000') {
      formList.value = res.data.data;
    }
  } catch (err) {
    ElMessage.error('加载运单列表失败');
  } finally {
    loading.value = false;
  }
};

// 搜索追踪
const searchTrack = async () => {
  if (!searchValue.value) {
    ElMessage.warning('请输入搜索内容');
    return;
  }
  
  loading.value = true;
  
  if (searchType.value === 'id') {
    // 按ID搜索
    const found = formList.value.find(f => String(f.id) === searchValue.value);
    if (found) {
      selectedForm.value = found;
      ElMessage.success('找到运单');
    } else {
      ElMessage.warning('未找到该运单');
    }
    loading.value = false;
  } else {
    // 按区块链地址搜索
    try {
      const res = await axios.post('/api/searchForm', {
        searchData: searchValue.value,
        userAddr: info.address
      });
      if (res.data.code === '4000' && res.data.data.length > 0) {
        selectedForm.value = res.data.data[0];
        ElMessage.success('找到运单');
      } else {
        ElMessage.warning('未找到该运单');
      }
    } catch (err) {
      ElMessage.error('搜索失败');
    } finally {
      loading.value = false;
    }
  }
};

// 选择运单
const selectForm = (row) => {
  selectedForm.value = row;
};

// 重置搜索
const resetSearch = () => {
  searchValue.value = '';
  selectedForm.value = null;
};

// 分页
const handlePageChange = (page) => {
  currentPage.value = page;
};

onMounted(() => {
  fetchFormList();
});
</script>

<style scoped lang="less">
.content {
  padding: 15px;
}

.search-card {
  margin-bottom: 16px;
  border-radius: 12px;
  
  .search-header {
    margin-bottom: 16px;
    
    .search-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 18px;
      font-weight: 600;
      color: #303133;
      margin-bottom: 4px;
      
      .title-icon {
        font-size: 24px;
        color: #667eea;
      }
    }
  }
}

.list-card {
  border-radius: 12px;
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 600;
  }
}

.back-btn {
  margin-bottom: 16px;
}

.info-card {
  border-radius: 12px;
  
  .info-header {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
    
    .el-icon {
      color: #667eea;
    }
  }
  
  .info-item {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 8px 0;
    
    .label {
      color: #909399;
      font-size: 13px;
      flex-shrink: 0;
    }
    
    .value {
      color: #303133;
      font-size: 13px;
      text-align: right;
      
      &.address {
        max-width: 180px;
        word-break: break-all;
      }
    }
  }
}

.timeline-card {
  border-radius: 12px;
  
  .timeline-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .header-left {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      
      .el-icon {
        color: #667eea;
      }
    }
  }
}

.track-visual {
  padding: 20px 0;
  overflow-x: auto;
  
  .track-line {
    display: flex;
    align-items: flex-start;
    gap: 0;
    min-width: max-content;
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      top: 20px;
      left: 20px;
      right: 20px;
      height: 3px;
      background: linear-gradient(90deg, #67c23a, #409eff);
      z-index: 0;
    }
  }
  
  .track-node {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 140px;
    position: relative;
    z-index: 1;
    
    .node-dot {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #67c23a;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 18px;
      box-shadow: 0 2px 8px rgba(103, 194, 58, 0.4);
    }
    
    &.active .node-dot {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
      animation: pulse 2s infinite;
    }
    
    .node-info {
      margin-top: 12px;
      text-align: center;
      
      .node-title {
        font-weight: 600;
        color: #303133;
        font-size: 14px;
      }
      
      .node-address {
        color: #606266;
        font-size: 12px;
        margin-top: 4px;
        max-width: 120px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      
      .node-time {
        color: #909399;
        font-size: 11px;
        margin-top: 4px;
      }
    }
  }
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(102, 126, 234, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(102, 126, 234, 0);
  }
}

.timeline-content {
  border-radius: 8px;
  
  .timeline-title {
    font-weight: 600;
    color: #303133;
    margin-bottom: 8px;
  }
  
  .timeline-desc,
  .timeline-contact,
  .timeline-blockchain {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #606266;
    font-size: 13px;
    margin-top: 4px;
    
    .el-icon {
      color: #909399;
    }
  }
  
  .timeline-blockchain {
    margin-top: 8px;
    
    .el-text {
      word-break: break-all;
    }
  }
}

:deep(.el-card) {
  border: none;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

:deep(.el-divider__text) {
  background: #fff;
  color: #909399;
  font-size: 13px;
}
</style>

