<template>
  <div class="content">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">
        <el-icon><i-ep-Search /></el-icon>
        查询运单
      </h2>
      <p class="page-desc">通过区块链地址查询电子运单信息</p>
    </div>

    <!-- 搜索卡片 -->
    <el-card class="search-card" shadow="hover">
      <div class="search-wrapper">
        <el-input 
          v-model="searchContent.searchData" 
          placeholder="请输入表单头的区块链地址码"
          size="large"
          clearable
          @keyup.enter="searchForm"
        >
          <template #prefix>
            <el-icon><i-ep-Link /></el-icon>
          </template>
        </el-input>
        <el-button type="primary" size="large" @click="searchForm" :loading="loading">
          <el-icon><i-ep-Search /></el-icon>
          搜索运单
        </el-button>
        <el-button size="large" @click="clear">
          <el-icon><i-ep-Delete /></el-icon>
          清除结果
        </el-button>
      </div>
      <div class="search-tips">
        <el-icon><i-ep-InfoFilled /></el-icon>
        <span>提示：区块链地址格式为 0x 开头的42位十六进制字符串</span>
      </div>
    </el-card>

    <!-- 结果卡片 -->
    <el-card class="result-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <el-icon><i-ep-Document /></el-icon>
            <span>查询结果</span>
          </div>
          <div class="header-right">
            <el-tag v-if="tableData.length > 0" type="success">
              找到 {{ tableData.length }} 条记录
            </el-tag>
          </div>
        </div>
      </template>
      
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        :max-height="500"
        stripe
        :border="false"
        class="custom-table"
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
                  </el-descriptions>

                  <el-tooltip
                    class="box-item"
                    effect="dark"
                    content="这里是商品信息详情"
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
                      {{ props.row.good?.barcode || '-' }}
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
                  </el-table>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="id" label="表单序号" />
            <el-table-column prop="logisticsInfoAddr" label="表单头区块链地址" />
            <el-table-column prop="formAddr" label="中转信息区块链地址" />
            <el-table-column prop="receiverAddr" label="收件人区块链地址" />
            <el-table-column prop="productAddr" label="商品区块链地址" />
          </el-table>
    </el-card>
  </div>
</template>
<script setup>
import axios from "axios";
import { aesDecrypt, aesEncrypt } from "@/utils/utils";
import { ElMessage } from "element-plus";
import { reactive, ref } from "vue";
const info = JSON.parse(
  aesDecrypt(localStorage.getItem("userSession"), "xpxxy")
);
const emptyText = ref("");
const searchContent = reactive({
  searchData:"",
  userAddr:info.address
});


const loading = ref(false);
const tableData = ref([]);



function searchForm(searchData){
    //加载遮罩
    loading.value = true
  axios.post("/api/searchForm", searchContent ).then((res) => {
   if (res.data.code == "4000") {
        loading.value = false;
        ElMessage.success("查询成功！")
        tableData.value = res.data.data;
      
    }
    else {
        loading.value = false;
        ElMessage.info("未找到您提供的表单信息")
        
    }
  });
};
function clear(){
    tableData.value = []
    ElMessage.success("清除成功！")
}
</script>
<style scoped lang="less">
.content {
  padding: 20px;
  min-height: calc(100vh - 90px);
  box-sizing: border-box;
}

.page-header {
  margin-bottom: 20px;
  padding: 20px 24px;
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(250, 112, 154, 0.3);
  
  .page-title {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #fff;
    font-size: 22px;
    margin: 0;
    
    .el-icon { font-size: 26px; }
  }
  
  .page-desc {
    color: rgba(255, 255, 255, 0.9);
    margin: 8px 0 0 0;
    font-size: 14px;
  }
}

.search-card {
  border-radius: 12px;
  border: none;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 20px;
  
  :deep(.el-card__body) { padding: 24px; }
}

.search-wrapper {
  display: flex;
  gap: 12px;
  align-items: center;
  
  .el-input {
    flex: 1;
    :deep(.el-input__wrapper) { box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08); }
  }
}

.search-tips {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: 8px;
  border-left: 3px solid #f59e0b;
  color: #92400e;
  font-size: 13px;
  
  .el-icon { font-size: 16px; }
}

.result-card {
  border-radius: 12px;
  border: none;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  
  :deep(.el-card__header) {
    padding: 16px 20px;
    border-bottom: 1px solid #f0f0f0;
    background: #fafafa;
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .header-left {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    font-weight: 600;
    color: #303133;
    
    .el-icon { color: #fa709a; }
  }
}

.custom-table {
  :deep(.el-table__header th) {
    background: #fafafa !important;
    color: #606266;
    font-weight: 600;
  }
}

.expandCard {
  padding: 20px;
  background: #fafafa;
  border-radius: 8px;
  
  h3 {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 15px;
    color: #303133;
    margin: 16px 0 12px 0;
    padding-left: 10px;
    border-left: 3px solid #fa709a;
    
    &:first-child { margin-top: 0; }
  }
}
</style>

