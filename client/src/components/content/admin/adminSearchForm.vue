<template>
  <div class="content">
    <!-- 搜索提示卡片 -->
    <div class="search-tips">
      <div class="tip-item">
        <el-icon class="tip-icon"><i-ep-InfoFilled /></el-icon>
        <span>支持通过表单头区块链地址精确查询运单信息</span>
      </div>
      <div class="tip-item">
        <el-icon class="tip-icon"><i-ep-Link /></el-icon>
        <span>区块链地址格式：0x开头的42位十六进制字符串</span>
      </div>
    </div>

    <el-card style="height: 100%">
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <span class="header-title">查询运单</span>
            <el-text type="info" size="small">通过区块链地址查询电子运单详情</el-text>
          </div>
          <div class="header-right">
            <el-tag v-if="isSearching" type="warning" effect="plain">
              <el-icon><i-ep-Search /></el-icon>
              搜索结果: {{ tableData.length }} 条
            </el-tag>
            <el-tag v-else type="success" effect="plain">
              <el-icon><i-ep-Document /></el-icon>
              全部数据: {{ allData.length }} 条
            </el-tag>
          </div>
        </div>
      </template>
      
      <!-- 搜索区域 -->
      <div class="search-area">
        <el-row :gutter="16" align="middle">
          <el-col :span="14">
            <el-input 
              v-model="searchContent.searchData" 
              placeholder="请输入表单头的区块链地址码（0x...）" 
              size="large"
              clearable
              @keyup.enter="searchForm"
            >
              <template #prefix>
                <el-icon><i-ep-Search /></el-icon>
              </template>
            </el-input>
          </el-col>
          <el-col :span="10">
            <el-button type="primary" size="large" @click="searchForm" :loading="loading">
              <el-icon><i-ep-Search /></el-icon>
              搜索
            </el-button>
            <el-button size="large" @click="clear">
              <el-icon><i-ep-Delete /></el-icon>
              清除数据
            </el-button>
            <el-dropdown trigger="click" @command="handleHistoryClick" v-if="searchHistory.length > 0">
              <el-button size="large">
                <el-icon><i-ep-Clock /></el-icon>
                搜索历史
                <el-icon class="el-icon--right"><i-ep-ArrowDown /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item v-for="(item, index) in searchHistory" :key="index" :command="item">
                    <el-icon><i-ep-Document /></el-icon>
                    {{ item.slice(0, 10) }}...{{ item.slice(-6) }}
                  </el-dropdown-item>
                  <el-dropdown-item divided command="clear-history">
                    <el-icon><i-ep-Delete /></el-icon>
                    清除历史
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </el-col>
        </el-row>
      </div>

      <!-- 快捷操作 -->
      <div class="quick-actions" v-if="tableData.length > 0">
        <el-tag 
          v-for="(item, index) in tableData" 
          :key="index" 
          closable 
          @close="removeItem(index)"
          class="result-tag"
        >
          运单 #{{ item.id }}
        </el-tag>
      </div>

      <el-divider v-if="tableData.length > 0" />
      
      <el-row>
        <el-col :span="24">
          <el-table
            v-loading="loading"
            element-loading-text="拼命加载中"
            :data="tableData"
            style="width: 100%"
            height="750px"
            stripe
            :border="true"
          >
            <template #empty>
              <p>{{ emptyText }}</p>
            </template>
            <el-table-column type="expand">
              <template #default="props">
                <div class="expandCard">
                  <el-tooltip
                    class="box-item"
                    effect="dark"
                    content="这里是电子表单的信息头"
                    placement="right"
                  >
                    <h3>表单头信息</h3>
                  </el-tooltip>
                  <el-descriptions :column="3" border>
                    <el-descriptions-item>
                      <template #label>
                        <div class="cell-item">
                          <el-icon>
                            <i-ep-UserFilled />
                          </el-icon>
                          收件人区块链地址
                        </div>
                      </template>
                      {{ props.row.receiverAddr }}
                    </el-descriptions-item>
                    <el-descriptions-item>
                      <template #label>
                        <div class="cell-item">
                          <el-icon>
                            <i-ep-Iphone />
                          </el-icon>
                          收件人联系方式
                        </div>
                      </template>
                      {{ props.row.receiverContact }}
                    </el-descriptions-item>
                    <el-descriptions-item>
                      <template #label>
                        <div class="cell-item">
                          <el-icon>
                            <i-ep-LocationFilled />
                          </el-icon>
                          收货地址
                        </div>
                      </template>
                      {{ props.row.receiverAddressInfo }}
                    </el-descriptions-item>

                    <el-descriptions-item>
                      <template #label>
                        <div class="cell-item">
                          <el-icon>
                            <i-ep-Van />
                          </el-icon>
                          发件人区块链地址
                        </div>
                      </template>
                      {{ props.row.senderAddr }}
                    </el-descriptions-item>
                    <el-descriptions-item>
                      <template #label>
                        <div class="cell-item">
                          <el-icon>
                            <i-ep-Cellphone />
                          </el-icon>
                          发件人联系方式
                        </div>
                      </template>
                      {{ props.row.senderContact }}
                    </el-descriptions-item>
                    <el-descriptions-item>
                      <template #label>
                        <div class="cell-item">
                          <el-icon>
                            <i-ep-OfficeBuilding />
                          </el-icon>
                          发货地址
                        </div>
                      </template>
                      {{ props.row.senderAddressInfo }}
                    </el-descriptions-item>

                    <el-descriptions-item>
                      <template #label>
                        <div class="cell-item">
                          <el-icon>
                            <i-ep-Coin />
                          </el-icon>
                          表单头区块链地址
                        </div>
                      </template>
                      {{ props.row.logisticsInfoAddr }}
                    </el-descriptions-item>
                    <el-descriptions-item>
                      <template #label>
                        <div class="cell-item">
                          <el-icon>
                            <i-ep-Tickets />
                          </el-icon>
                          中转信息区块链地址
                        </div>
                      </template>
                      {{ props.row.formAddr }}
                    </el-descriptions-item>
                    <el-descriptions-item>
                      <template #label>
                        <div class="cell-item">
                          <el-icon>
                            <i-ep-Box />
                          </el-icon>
                          商品信息区块链地址
                        </div>
                      </template>
                      {{ props.row.productAddr }}
                    </el-descriptions-item>
                    <el-descriptions-item min-width="100">
                      <template #label>
                        <div class="cell-item">
                          <el-icon>
                            <i-ep-Compass />
                          </el-icon>
                          当前业务状态
                        </div>
                      </template>
                      <el-tag v-if="props.row.status==='on'" type="success">正在进行当中</el-tag>
                      <el-tag v-if="props.row.status==='off'" type="info">正在进行当中</el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item>
                      <template #label>
                        <div class="cell-item">
                          <el-icon>
                            <i-ep-Clock />
                          </el-icon>
                          表单创建时间
                        </div>
                      </template>
                      {{ props.row.createdAt }}
                    </el-descriptions-item>
                  </el-descriptions>

                  <el-tooltip
                    class="box-item"
                    effect="dark"
                    content="这里是商品信息详情,点击条码可以前往中国商品信息服务平台进一步查询细节信息"
                    placement="right"
                  >
                    <h3>商品基本信息</h3>
                  </el-tooltip>
                  <el-descriptions :column="5" border direction="vertical">
                    <el-descriptions-item>
                      <template #label>
                        <div class="cell-item">
                          <el-icon>
                            <i-ep-Box />
                          </el-icon>
                          商品名称信息
                        </div>
                      </template>
                      {{ props.row.good?.productName || '-' }}
                    </el-descriptions-item>
                    <el-descriptions-item>
                      <template #label>
                        <div class="cell-item">
                          <el-icon>
                            <i-ep-Calendar />
                          </el-icon>
                          商品生产日期
                        </div>
                      </template>
                      {{ props.row.good?.productionDate || '-' }}
                    </el-descriptions-item>

                    <el-descriptions-item>
                      <template #label>
                        <div class="cell-item">
                          <el-icon>
                            <i-ep-Calendar />
                          </el-icon>
                          商品保质期至
                        </div>
                      </template>
                      {{ props.row.good?.expirationDate || '-' }}
                    </el-descriptions-item>

                    <el-descriptions-item>
                      <template #label>
                        <div class="cell-item">
                          <el-icon>
                            <i-ep-Memo />
                          </el-icon>
                          商品类别
                        </div>
                      </template>
                      {{ props.row.good?.productType || '-' }}
                    </el-descriptions-item>

                    <el-descriptions-item>
                      <template #label>
                        <div class="cell-item">
                          <el-icon>
                            <i-ep-Postcard />
                          </el-icon>
                          商品条码
                        </div>
                      </template>
                      <span @click="get(props.row.good?.barcode)">{{ props.row.good?.barcode || '-' }}</span>
                    </el-descriptions-item>
                  </el-descriptions>

                  <el-tooltip
                    class="box-item"
                    effect="dark"
                    content="这里是中转方的信息列表，自上到下为中转经过的实际顺序"
                    placement="right"
                  >
                    <h3>中转方溯源信息</h3>
                  </el-tooltip>

                  <el-table :data="props.row.forms" :border="true">
                    <el-table-column
                      label="中转方区块链地址"
                      prop="transitAddr"
                    />
                    <el-table-column
                      label="中转方联系方式"
                      prop="transitContact"
                    />
                    <el-table-column label="中转地址" prop="transitAddrInfo" />
                    <el-table-column label="更新时间" prop="createdAt" />
                  </el-table>
                </div>
              </template>
            </el-table-column>
            <el-table-column width="70" prop="id" label="表单ID" />
            <el-table-column prop="logisticsInfoAddr" label="表单头区块链地址" />
            <el-table-column prop="formAddr" label="中转信息区块链地址" />
            <el-table-column prop="receiverAddr" label="收件人区块链地址" />
            <el-table-column prop="productAddr" label="商品区块链地址" />
            <el-table-column prop="createdAt" label="表单创建时间" />
          </el-table>
        </el-col>
      </el-row>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="tableData.length"
      />
    </el-card>
  </div>
</template>
<script setup>
import axios from "axios";
import { aesDecrypt, aesEncrypt } from "@/utils/utils";
import { ElMessage } from "element-plus";
import { reactive, ref, onMounted } from "vue";

const info = JSON.parse(
  aesDecrypt(localStorage.getItem("userSession"), "xpxxy")
);
const emptyText = ref("");
const searchContent = reactive({
  searchData: "",
  userAddr: info.address
});

const loading = ref(false);
const tableData = ref([]);
const allData = ref([]);  // 存储所有数据
const searchHistory = ref([]);
const isSearching = ref(false);  // 是否在搜索模式

// 加载所有数据和搜索历史
onMounted(() => {
  // 加载搜索历史
  const history = localStorage.getItem('searchHistory');
  if (history) {
    searchHistory.value = JSON.parse(history);
  }
  
  // 加载所有表单数据
  fetchAllData();
});

// 获取所有数据
const fetchAllData = () => {
  loading.value = true;
  axios.post("/api/getAllForm").then((res) => {
    if (res.data.code == "4000") {
      allData.value = res.data.data;
      tableData.value = res.data.data;
    }
    loading.value = false;
  }).catch(err => {
    loading.value = false;
    ElMessage.error("加载数据失败");
  });
};

// 保存搜索历史
const saveHistory = (addr) => {
  if (!addr || searchHistory.value.includes(addr)) return;
  searchHistory.value.unshift(addr);
  if (searchHistory.value.length > 10) {
    searchHistory.value.pop();
  }
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value));
};

// 处理历史记录点击
const handleHistoryClick = (command) => {
  if (command === 'clear-history') {
    searchHistory.value = [];
    localStorage.removeItem('searchHistory');
    ElMessage.success('搜索历史已清除');
  } else {
    searchContent.searchData = command;
    searchForm();
  }
};

// 移除单个结果
const removeItem = (index) => {
  tableData.value.splice(index, 1);
};

function searchForm() {
  if (!searchContent.searchData) {
    // 如果搜索框为空，显示所有数据
    tableData.value = allData.value;
    isSearching.value = false;
    return;
  }
  
  // 验证地址格式
  if (!searchContent.searchData.startsWith('0x')) {
    ElMessage.warning("区块链地址应以0x开头");
    return;
  }
  
  isSearching.value = true;
  loading.value = true;
  axios.post("/api/searchForm", searchContent).then((res) => {
    if (res.data.code == "4000") {
      loading.value = false;
      ElMessage.success("查询成功！");
      tableData.value = res.data.data;
      saveHistory(searchContent.searchData);
    } else {
      loading.value = false;
      ElMessage.info("未找到您提供的表单信息");
      tableData.value = [];
    }
  }).catch(err => {
    loading.value = false;
    ElMessage.error("查询失败，请稍后重试");
  });
}

function clear() {
  tableData.value = allData.value;
  searchContent.searchData = "";
  isSearching.value = false;
  ElMessage.success("已恢复显示全部数据！");
}

function get(value) {
  window.open("https://www.gds.org.cn/#/barcodeList/index?type=barcode&keyword=" + value);
}
</script>
<style scoped lang="less">
.content {
  padding: 15px;
}

.search-tips {
  display: flex;
  gap: 24px;
  margin-bottom: 16px;
  padding: 16px 20px;
  background: linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%);
  border-radius: 12px;
  border-left: 4px solid #0ea5e9;
}

.tip-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #0369a1;
  font-size: 13px;
  
  .tip-icon {
    font-size: 16px;
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
  
  .header-title {
    font-size: 16px;
    font-weight: 600;
    color: #fff;
  }
  
  :deep(.el-text) {
    color: rgba(255, 255, 255, 0.8);
  }
}

.header-right {
  :deep(.el-tag) {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
    color: #fff;
  }
}

.search-area {
  margin-bottom: 20px;
  
  :deep(.el-input__wrapper) {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
  
  :deep(.el-button) {
    margin-right: 8px;
  }
}

.quick-actions {
  margin: 16px 0;
  
  .result-tag {
    margin-right: 8px;
    margin-bottom: 8px;
  }
}

:deep(.el-card) {
  border-radius: 12px;
  border: none;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

:deep(.el-card__header) {
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px 12px 0 0;
}

:deep(.el-table) {
  font-size: 13px;
  
  th {
    background: #fafafa !important;
    color: #606266;
    font-weight: 600;
  }
}

.expandCard {
  padding: 20px;
  background: #fafafa;
  
  h3 {
    display: inline-block;
    font-size: 15px;
    color: #303133;
    margin: 20px 0 12px 0;
    padding-left: 10px;
    border-left: 3px solid #409eff;
    
    &:first-child {
      margin-top: 0;
    }
  }
}

.cell-item {
  display: flex;
  align-items: center;
  gap: 6px;
  
  .el-icon {
    color: #909399;
  }
}

:deep(.el-pagination) {
  margin-top: 20px;
  justify-content: center;
}

p {
  font-size: 14px;
}
</style>

