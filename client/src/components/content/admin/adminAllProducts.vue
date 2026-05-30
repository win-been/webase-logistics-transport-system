<template>
  <div class="content">
    <el-card style="height: 100%">
      <template #header>
        <div class="card-header">
          <span>当前在库商品数据列表</span>
        </div>
      </template>
      <el-row>
        <el-col :span="24">
          <el-table
            v-loading="loading"
            :data="paginatedData"
            style="width: 100%"
            stripe
            :border="true"
          >
            <template #empty>
              <p>{{ emptyText }}</p>
            </template>
            <el-table-column prop="productName" label="商品名称" width="220" show-overflow-tooltip />
            <el-table-column prop="productType" label="商品类别" width="180" />
            <el-table-column prop="productNum" label="数量" width="140" />
            <el-table-column prop="productionDate" label="生产日期" width="200" />
            <el-table-column prop="expirationDate" label="保质期至" width="200" />
            <el-table-column prop="barcode" label="条码" width="240" show-overflow-tooltip />
            <el-table-column prop="productAddr" label="区块链地址" width="400" show-overflow-tooltip>
                <template #default={row}>
                    <el-tag type="info" style="max-width: 100%; word-break: break-all;">{{ row.productAddr }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="createdAt" label="入库时间" width="240" />
            <el-table-column label="操作" width="180" fixed="right">
              <template #default={row}>
                <el-button type="primary" size="small" @click="editQuantity(row)">修改数量</el-button>
                <el-button type="danger" size="small" @click="deleteProduct(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-pagination
        background
        
        @current-change="handleCurrentChange"  
        :current-page="currentPage"  
        :page-size="pageSize"  
        layout="prev, pager, next"  
        :total="totalItems"
      />
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

  <el-dialog v-model="editQuantityDialogVisible" title="修改商品数量" width="400">
    <el-form>
      <el-form-item label="商品名称">
        <el-input v-model="currentProduct.productName" disabled />
      </el-form-item>
      <el-form-item label="当前数量">
        <el-input v-model.number="currentProduct.productNum" type="number" min="1" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="editQuantityDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmEditQuantity">确认修改</el-button>
      </div>
    </template>
  </el-dialog>
  </div>
</template>
<script setup>
import axios from "axios";
import { ElMessage } from "element-plus";
import { ref, reactive, onMounted, computed } from "vue";

const dialogVisible = ref(false)
const editQuantityDialogVisible = ref(false)
const emptyText = ref("");
const empty = ref(false);
const loading = ref(true);
const tableData = ref([]);
const searchBarcode = ref('');
const currentProduct = reactive({
  id: null,
  productName: '',
  productNum: 1,
  productAddr: ''
});
onMounted(() => {
  axios.get("/api/findAllGoods").then((res) => {
    console.log("前端收到的数据：", res.data.data);
    if (res.data.code == "3001") {
      ElMessage.info("暂时没有商品数据");
      emptyText.value = "暂无数据";
      loading.value = false;
      return;
    }
    if (res.data.code == "3000") {
      console.log("第一条数据详情：", res.data.data[0]);
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
const pageSize = ref(10); // 每页显示的条目数  
const currentPage = ref(1); // 当前页码 
const paginatedData = computed(() => {  
      const start = (currentPage.value - 1) * pageSize.value;  
      const end = start + pageSize.value;  
      return tableData.value.slice(start, end);  
    });
function handleCurrentChange(newPage) {  
      currentPage.value = newPage;  
    }
function stop(row){
  const product = {
    productAddr: row.productAddr,
    status: row.status,
  }
  ElMessageBox.confirm('是否停用？','提示',{
    confirmButtonText:'是',
    cancelButtonText:'否',
    type:"warning",
    showClose:'false',
    beforeClose:(action, instance, done)=>{
      if(action ==='cancel'){
        ElMessage.info("取消")
      }
      done();
    }
  }).then(action=>{
    if(action === 'confirm'){
      const loadingInstance = ElLoading.service({text:"正在更新中"})
      dialogVisible.value = false;
      axios.post('/api/changeProductStatus',product ).then(res=>{
        if(res.data.code==='3005'){
          axios.get("/api/findAllGoods").then(response=>{
            if(response.data.code === '3000'){
              tableData.value = response.data.data;
              loadingInstance.close()
              ElMessage.success("更新成功！")

            }else{
              loadingInstance.close();
              ElMessage.error("更新列表时出错！")
            }
          })
        }else if(res.data.code ==='3006'){
          loadingInstance.close()
          ElMessage.error("该商品当前被订单占用不得停用")
        }
      }).catch(err=>{
        // console.log(err)
        loadingInstance.close();
        ElMessage.error("出错了")
      })
    }
  })
}
function open(row){
  const product = {
    productAddr: row.productAddr,
    status: row.status,
  }
  ElMessageBox.confirm('是否启用？','提示',{
    confirmButtonText:'是',
    cancelButtonText:'否',
    type:"warning",
    showClose:'false',
    beforeClose:(action, instance, done)=>{
      if(action ==='cancel'){
        ElMessage.info("取消")
      }
      done();
    }
  }).then(action=>{
    if(action === 'confirm'){
      const loadingInstance = ElLoading.service({text:"正在更新中"})
      dialogVisible.value = false;
      axios.post('/api/changeProductStatus',product ).then(res=>{
        if(res.data.code==='3005'){
          axios.get("/api/findAllGoods").then(response=>{
            if(response.data.code === '3000'){
              tableData.value = response.data.data;
              loadingInstance.close()
              ElMessage.success("更新成功！")

            }else{
              loadingInstance.close();
              ElMessage.error("更新列表时出错！")
            }
          })
        }else if(res.data.code ==='3006'){
          loadingInstance.close()
          ElMessage.error("该商品当前被订单占用不得停用")
        }
      }).catch(err=>{
        // console.log(err)
        loadingInstance.close();
        ElMessage.error("出错了")
      })
    }
  })
}

function editQuantity(row) {
  currentProduct.id = row.id;
  currentProduct.productName = row.productName;
  currentProduct.productNum = row.productNum;
  currentProduct.productAddr = row.productAddr;
  editQuantityDialogVisible.value = true;
}

function confirmEditQuantity() {
  axios.post('/api/updateProductQuantity', {
    id: currentProduct.id,
    productNum: currentProduct.productNum
  }).then(res => {
    if (res.data.code === '3003') {
      ElMessage.success("数量修改成功！");
      editQuantityDialogVisible.value = false;
      // 刷新列表
      axios.get("/api/findAllGoods").then(response => {
        if (response.data.code === '3000') {
          tableData.value = response.data.data;
        }
      });
    } else {
      ElMessage.error("修改失败");
    }
  }).catch(err => {
    ElMessage.error("修改出错");
  });
}

function deleteProduct(row) {
  ElMessageBox.confirm('确定要删除该商品吗？删除后将无法恢复！', '警告', {
    confirmButtonText: '确定删除',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    axios.post('/api/deleteProduct', {
      id: row.id
    }).then(res => {
      if (res.data.code === '3004') {
        ElMessage.success("商品删除成功！");
        // 刷新列表
        axios.get("/api/findAllGoods").then(response => {
          if (response.data.code === '3000') {
            tableData.value = response.data.data;
          }
        });
      } else {
        ElMessage.error("删除失败");
      }
    }).catch(err => {
      ElMessage.error("删除出错");
    });
  }).catch(() => {
    ElMessage.info("已取消删除");
  });
}
</script>
<style scoped lang="less">
.content {
  padding: 15px;
  min-height: calc(100vh - 90px);
  box-sizing: border-box;
}

:deep(.el-card) {
  border-radius: 12px;
  border: none;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  height: 100%;
}

:deep(.el-card__header) {
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px 12px 0 0;
}

.card-header {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
}

:deep(.el-table) {
  font-size: 13px;
  border-radius: 0 0 12px 12px;
  
  th {
    background: #fafafa !important;
    color: #606266;
    font-weight: 600;
    padding: 14px 0;
  }
  
  td {
    color: #606266;
    padding: 12px 0;
  }
  
  .el-table__row:hover > td {
    background: #f5f7fa !important;
  }
}

:deep(.el-pagination) {
  margin-top: 20px;
  justify-content: center;
}

:deep(.el-dialog) {
  border-radius: 12px;
  
  .el-dialog__header {
    border-bottom: 1px solid #f0f0f0;
    padding: 16px 20px;
    margin: 0;
  }
  
  .el-dialog__body {
    padding: 20px;
  }
  
  .el-dialog__footer {
    border-top: 1px solid #f0f0f0;
    padding: 12px 20px;
  }
}

.expandCard {
  padding: 20px;
  background: #fafafa;
}

h3 {
  display: inline-block;
}
</style>



