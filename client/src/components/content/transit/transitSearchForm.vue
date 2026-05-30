<template>
  <div class="content">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">
        <el-icon><i-ep-Search /></el-icon>
        搜索运单
      </h2>
      <p class="page-desc">通过区块链地址查询电子运单信息</p>
    </div>

    <el-card class="main-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <el-icon><i-ep-Document /></el-icon>
            <span>运单查询</span>
          </div>
        </div>
      </template>
      
      <!-- 搜索区域 -->
      <div class="search-area">
        <el-input 
          v-model="searchContent.searchData" 
          placeholder="请输入表单头的区块链地址码"
          class="search-input"
          clearable
        >
          <template #prefix>
            <el-icon><i-ep-Link /></el-icon>
          </template>
        </el-input>
        <el-button type="primary" @click="searchForm">
          <el-icon><i-ep-Search /></el-icon>
          搜索
        </el-button>
        <el-button @click="clear">
          <el-icon><i-ep-Delete /></el-icon>
          清除
        </el-button>
      </div>
      
      <el-table
        v-loading="loading"
        element-loading-text="拼命加载中"
        :data="tableData"
        style="width: 100%"
        :max-height="550"
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
      
      <div class="pagination-wrapper">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="tableData.length"
        />
      </div>
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
function get(value){
  window.open("https://www.gds.org.cn/#/barcodeList/index?type=barcode&keyword="+value)
  
}
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
  }
}

.search-area {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  
  .search-input {
    flex: 1;
  }
}

.custom-table {
  :deep(.el-table__header th) {
    background: #f8f9fa;
    color: #606266;
    font-weight: 600;
  }
  
  :deep(.el-table__row) {
    transition: all 0.3s;
    
    &:hover {
      background: #f0f5ff !important;
    }
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
    border-left: 3px solid #667eea;
    
    &:first-child {
      margin-top: 0;
    }
  }
}
</style>

