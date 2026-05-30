<template>
  <div class="content">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left">
        <h2 class="page-title">
          <el-icon><i-ep-Box /></el-icon>
          当前在库商品
        </h2>
        <p class="page-desc">查看所有在库商品信息</p>
      </div>
      <div class="header-right">
        <el-tag type="success" size="large" effect="plain">
          <el-icon><i-ep-Goods /></el-icon>
          共 {{ tableData.length }} 件商品
        </el-tag>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
          <el-icon><i-ep-Box /></el-icon>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ tableData.length }}</span>
          <span class="stat-label">商品总数</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);">
          <el-icon><i-ep-Postcard /></el-icon>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ tableData.filter(item => item.barcode).length }}</span>
          <span class="stat-label">有条码商品</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
          <el-icon><i-ep-Collection /></el-icon>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ [...new Set(tableData.map(item => item.productType))].length }}</span>
          <span class="stat-label">商品类别</span>
        </div>
      </div>
    </div>

    <el-card class="main-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <el-icon><i-ep-List /></el-icon>
            <span>商品列表</span>
          </div>
        </div>
      </template>
      <el-table
        v-loading="loading"
        :data="paginatedData"
        style="width: 100%"
        :max-height="550"
        stripe
        :border="false"
        class="custom-table"
      >
        <template #empty>
          <el-empty :description="emptyText || '暂无商品数据'" />
        </template>
        <el-table-column prop="productName" label="商品名称" min-width="120">
          <template #default={row}>
            <div class="product-name">
              <el-icon><i-ep-Goods /></el-icon>
              <span>{{ row.productName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="productionDate" label="生产日期" width="120" />
        <el-table-column prop="expirationDate" label="保质期至" width="120" />
        <el-table-column prop="productType" label="商品类别" width="100">
          <template #default={row}>
            <el-tag size="small">{{ row.productType }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="barcode" label="商品条码" width="140">
          <template #default={row}>
            <el-button type="primary" link @click="display(row.barcode)">
              <el-icon><i-ep-Search /></el-icon>
              {{ row.barcode }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="productNum" label="库存数量" width="100" align="center">
          <template #default={row}>
            <el-tag :type="row.productNum > 0 ? 'success' : 'danger'" effect="light">
              {{ row.productNum }} 件
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="入库时间" width="180" />
      </el-table>
      
      <div class="pagination-wrapper">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next"
          :total="totalItems"
        />
      </div>
    </el-card>
    <el-dialog
    v-model="dialogVisible"
    title="确认"
    width="500"
  ><div style="display:flex;align-items:center"><img src="@/assets/gs1_logo.png" />您即将前往中国商品信息服务平台查询条码数据，是否确认？</div>
    
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="go">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
  </div>
</template>
<script setup>
import axios from "axios";
import { ElMessage } from "element-plus";
import {ref, reactive, onMounted, computed} from "vue";

const dialogVisible = ref(false)
const emptyText = ref("");
const empty = ref(false);
const loading = ref(true);
const tableData = ref([]);
const searchBarcode = ref('');
onMounted(() => {
  axios.get("/api/findAllGoods").then((res) => {
    if (res.data.code == "3001") {
      ElMessage.info("暂时没有商品数据");
      emptyText.value = "暂无数据";
      loading.value = false;
      return;
    }
    if (res.data.code == "3000") {
      tableData.value = res.data.data;
      loading.value = false;
    }
  }).catch(err=>{
    loading.value = false;
    ElMessage.error("超时")
  });
});
function go(){
  window.open("https://www.gds.org.cn/#/barcodeList/index?type=barcode&keyword="+searchBarcode.value)
}
function display(value){
    dialogVisible.value = true;
    searchBarcode.value = value;
}
const totalItems = computed(() => tableData.value.length);
const pageSize = ref(8); // 每页显示的条目数
const currentPage = ref(1); // 当前页码
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return tableData.value.slice(start, end);
});
function handleCurrentChange(newPage) {
  currentPage.value = newPage;
}
</script>
<style scoped lang="less">
.content {
  padding: 20px;
  min-height: calc(100vh - 90px);
  box-sizing: border-box;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 20px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  
  .page-title {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #fff;
    font-size: 22px;
    margin: 0;
    .el-icon { font-size: 26px; }
  }
  .page-desc { color: rgba(255, 255, 255, 0.8); margin: 8px 0 0 0; font-size: 14px; }
  .header-right :deep(.el-tag) { background: rgba(255, 255, 255, 0.2); border-color: rgba(255, 255, 255, 0.3); color: #fff; padding: 8px 16px; }
}

.stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 20px; }

.stat-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
  &:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12); }
}

.stat-icon {
  width: 52px; height: 52px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  .el-icon { font-size: 26px; color: #fff; }
}

.stat-info {
  display: flex; flex-direction: column;
  .stat-value { font-size: 28px; font-weight: 700; color: #303133; }
  .stat-label { font-size: 13px; color: #909399; margin-top: 4px; }
}

.main-card {
  border-radius: 12px; border: none;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  :deep(.el-card__header) { padding: 16px 20px; border-bottom: 1px solid #f0f0f0; background: #fafafa; }
  .card-header {
    display: flex; justify-content: space-between; align-items: center;
    .header-left { display: flex; align-items: center; gap: 8px; font-size: 16px; font-weight: 600; color: #303133; .el-icon { color: #667eea; } }
  }
}

.custom-table :deep(.el-table__header th) { background: #fafafa !important; color: #606266; font-weight: 600; }

.product-name { display: flex; align-items: center; gap: 8px; .el-icon { color: #667eea; } }

.pagination-wrapper { margin-top: 20px; display: flex; justify-content: center; }

.dialog-content { text-align: center; padding: 20px 0; .gs1-logo { width: 120px; margin-bottom: 16px; } }
</style>
