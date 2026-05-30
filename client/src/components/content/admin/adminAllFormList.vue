<template>
  <div class="content">
    <el-card style="height: 100%">
      <template #header>
        <div class="card-header">
          <span>更新物流运单</span>

        </div>
      </template>
      <el-row>
        <el-col :span="24">
          <el-table
            v-loading="loading"
            element-loading-text="更新数据中，这可能需要一些时间"
            :data="paginatedData"
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
                    <el-descriptions-item>
                      <template #label>
                        <div class="cell-item">
                          <el-icon>
                            <i-ep-Van />
                          </el-icon>
                          承运公司
                        </div>
                      </template>
                      {{ props.row.logisticsCompanyName }}
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
                      <el-tag v-if="props.row.status === 'on'" type="success"
                        >正在进行当中</el-tag
                      >
                      <el-tag v-if="props.row.status === 'off'" type="info"
                        >表单已完成</el-tag
                      >
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
                    <el-descriptions-item>
                      <template #label>
                        <div class="cell-item">
                          <el-icon>
                            <i-ep-Edit />
                          </el-icon>
                          更新中转数据
                        </div>
                      </template>
                      <el-button v-if="props.row.status==='on'" type="primary" @click="handleUpdate(props.row)"
                        >更新</el-button
                      >
                      <el-button v-if="props.row.status==='off'" type="primary" disabled
                        >不可更新</el-button
                      >
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
                      {{ props.row.good?.productName || '暂无' }}
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
                      {{ props.row.good?.productionDate || '暂无' }}
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
                      {{ props.row.good?.expirationDate || '暂无' }}
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
                      {{ props.row.good?.productType || '暂无' }}
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
                      <span @click="get(props.row.good?.barcode)">{{ props.row.good?.barcode || '暂无' }}</span>
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
            <el-table-column
              prop="logisticsInfoAddr"
              label="表单头区块链地址"
            />
            <el-table-column prop="formAddr" label="中转信息区块链地址" />
            <el-table-column prop="receiverAddr" label="收件人区块链地址" />
            <el-table-column prop="productAddr" label="商品区块链地址" />
            <el-table-column prop="createdAt" label="表单创建时间" />
            <el-table-column prop="status" label="表单当前状态">
              <template #default={row}>
                <el-tag v-if="row.status==='on'" type="success">状态正常</el-tag>
                <el-tag v-if="row.status==='off'" type="info">停用</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="操作" width="180">
              <template #default={row}>
                <el-button v-if="row.status==='off'" @click="handleStart(row)" type="success" size="small">启动表单</el-button>
                <el-button v-if="row.status==='on'" @click="handleStop(row)" type="danger" size="small">结束表单</el-button>
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

      <el-dialog
        v-model="dialogVisible"
        title="中转方信息表单填写"
        width="600"
        :show-close="false"
        :close-on-click-modal="false"
      >
      <el-row>
        <el-col>
          <el-form :rules="Rules" ref="transitFormRef" :model="transitForm" label-width="auto">
          <el-form-item label="选择中转方" prop="transitAddr">
            <el-select 
              v-model="transitForm.selectedUserId" 
              placeholder="请选择中转方用户" 
              style="width: 100%"
              filterable
              @change="handleUserSelect"
            >
              <el-option
                v-for="user in transitUserList"
                :key="user.id"
                :label="`${user.name} (${user.phone})`"
                :value="user.id"
              >
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span>{{ user.name }}</span>
                  <span style="color: #909399; font-size: 12px;">{{ user.phone }}</span>
                </div>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="中转方区块链地址">
            <el-input v-model="transitForm.transitAddr" placeholder="选择中转方后自动填充" disabled>
              <template #prefix>
                    <el-icon class="el-input__icon">
                      <i-ep-Coin />
                    </el-icon>
                  </template>
            </el-input>  
          </el-form-item>
          <el-form-item label="中转方联系电话">
            <el-input v-model="transitForm.transitContact" placeholder="选择中转方后自动填充" disabled>
              <template #prefix>
                    <el-icon class="el-input__icon">
                      <i-ep-Phone />
                    </el-icon>
                  </template>
            </el-input> 
              
          </el-form-item>
          <el-form-item label="中转地址" prop="transitAddrInfo">
              <div style="display:flex; flex-warp:nowarp; width:100%">
                <el-cascader placeholder="请选择" style="width: 70%" size="default" :options="pcaTextArr" v-model="transitForm.transitAddrInfo1" @change="handleCascaderChange"></el-cascader>
                <el-input id="transitAddrInfo" placeholder="请输入详细地址" v-model="transitForm.transitAddrInfo2">
                  <template #prefix>
                    <el-icon class="el-input__icon">
                      <i-ep-Location />
                    </el-icon>
                  </template>
                </el-input>
              </div>
            </el-form-item>
        </el-form>
        </el-col>
        
      </el-row>
        
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="dialogVisible = false">取消操作</el-button>
            <el-button type="primary" @click="updateShow"> 确认操作 </el-button>
          </div>
        </template>
      </el-dialog>
      <el-dialog
        v-model="stopVisible"
        title="结束最终提交"
        width="600"
        :show-close="false"
        :close-on-click-modal="false"
      >
      <el-row>
        <el-col>
          <el-form :rules="Rules" ref="transitFormRef" :model="transitForm" label-width="auto">
          <el-form-item label="最后中转区块链地址" prop="transitAddr">
            <el-input v-model="transitForm.transitAddr" placeholder="请填入区块链地址">
              <template #prefix>
                    <el-icon class="el-input__icon">
                      <i-ep-Coin />
                    </el-icon>
                  </template>
            </el-input>  
          </el-form-item>
          <el-form-item label="联系电话" prop="transitContact" >
            <el-input v-model="transitForm.transitContact" placeholder="请填入电话号码">
              <template #prefix>
                    <el-icon class="el-input__icon">
                      <i-ep-Phone />
                    </el-icon>
                  </template>
            </el-input> 
              
          </el-form-item>
          <el-form-item label="最后中转地址" prop="transitAddrInfo">
              <div style="display:flex; flex-warp:nowarp; width:100%">
                <el-cascader placeholder="请选择" style="width: 70%" size="default" :options="pcaTextArr" v-model="transitForm.transitAddrInfo1" @change="handleCascaderChange"></el-cascader>
                <el-input id="transitAddrInfo" placeholder="请输入详细地址" v-model="transitForm.transitAddrInfo2">
                  <template #prefix>
                    <el-icon class="el-input__icon">
                      <i-ep-Location />
                    </el-icon>
                  </template>
                </el-input>
              </div>
            </el-form-item>
        </el-form>
        </el-col>
        
      </el-row>
        
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="stopVisible = false">取消操作</el-button>
            <el-button type="primary" @click="stopShow"> 确认操作 </el-button>
          </div>
        </template>
      </el-dialog>

      <!-- 启动表单对话框 -->
      <el-dialog
        v-model="startVisible"
        title="启动表单"
        width="400"
        :close-on-click-modal="false"
      >
        <div style="text-align: center; padding: 20px;">
          <el-icon style="font-size: 48px; color: #67c23a; margin-bottom: 16px;"><i-ep-CircleCheckFilled /></el-icon>
          <p style="font-size: 16px; color: #303133; margin-bottom: 8px;">确定要启动此表单吗？</p>
          <p style="font-size: 13px; color: #909399;">启动后表单将恢复为运输中状态</p>
        </div>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="startVisible = false">取消</el-button>
            <el-button type="success" @click="startSubmit">确认启动</el-button>
          </div>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>
<script setup>
import axios from "axios";
import { aesDecrypt, aesEncrypt } from "@/utils/utils";
import { pcaTextArr } from "element-china-area-data"
import { ElLoading, ElMessage, ElMessageBox } from "element-plus";
import { reactive, ref,onMounted, computed  } from "vue";
const info = JSON.parse(
  aesDecrypt(localStorage.getItem("userSession"), "xpxxy")
);
const emptyText = ref("");
const searchContent = reactive({
  searchData: "",
  userAddr: info.address,
});

const loading = ref(false);
const tableData = ref([]);
const dialogVisible = ref(false);
const stopVisible = ref(false);
const startVisible = ref(false);
const currentFormAddr = ref('');
const transitUserList = ref([]);  // 中转方用户列表
const transitForm = reactive({
  formAddr: "",
  transitAddr:"",
  transitContact:"",
  transitAddrInfo:"",
  transitAddrInfo1:[],
  transitAddrInfo2:"",
  selectedUserId: null  // 选中的用户ID
})
const transitFormRef = ref();
const Rules = reactive({
  transitAddr:[ { required: true, message: "这是必填项目", trigger: "change" }],
  transitContact:[{ required: true, message: "这是必填项目", trigger: "change" }],
  transitAddrInfo: [
    { required: true, message: "这是必填项目", trigger: "change" },
  ],
  transitAddrInfo1: [
    { required: true, message: "这是必填项目", trigger: "change" },
  ],
  transitAddrInfo2: [
    { required: true, message: "这是必填项目", trigger: "change" },
  ]
});


onMounted(() => {
  // 获取所有表单
  axios.post("/api/getAllForm").then((res) => {
    if (res.data.code == "4001") {
      ElMessage.info("暂时没有表单数据");
      emptyText.value = "暂无数据";
      loading.value = false;
      return;
    }
    if (res.data.code == "4000") {
      tableData.value = res.data.data;
      loading.value = false;
    }
  }).catch(err=>{
    loading.value = false;
    ElMessage.error("超时")
  });
  
  // 获取中转方用户列表
  axios.get("/api/getAllUser").then((res) => {
    if (res.data.code == "2000") {
      // 过滤出中转方用户（role为transit）且状态正常的用户
      transitUserList.value = res.data.data.filter(user => user.role === 'transit' && user.status === 'on');
    }
  });
});
function handleCascaderChange(value){
  let area =''
  transitForm.transitAddrInfo1.forEach((item) =>{
    area+=item;
  })
  transitForm.transitAddrInfo = area;
}
function stopShow(){
  // console.log(tableData.value)
  transitForm.transitAddrInfo = transitForm.transitAddrInfo+transitForm.transitAddrInfo2
  transitFormRef.value.validate(async (valid) => {
    if(valid){
      stopSubmit()
    }
    else{
      ElMessage.error("请先完成表单")
    }
  });
}
function updateShow(){
  transitForm.transitAddrInfo = transitForm.transitAddrInfo+transitForm.transitAddrInfo2
  transitFormRef.value.validate(async (valid) => {
    if(valid){
      updateSubmit()
    }
    else{
      ElMessage.error("请先完成表单")
    }
  });
}

function emptyForm(){
          transitForm.formAddr="",
          transitForm.transitAddr="",
          transitForm.transitAddrInfo="",
          transitForm.transitContact="",
          transitForm.transitAddrInfo1=[],
          transitForm.transitAddrInfo2="",
          transitForm.logisticsInfoAddr="",
          transitForm.selectedUserId=null
}

// 选择用户后自动填充地址和电话
function handleUserSelect(userId) {
  const selectedUser = transitUserList.value.find(user => user.id === userId);
  if (selectedUser) {
    transitForm.transitAddr = selectedUser.address;
    transitForm.transitContact = selectedUser.phone;
  }
}
function handleUpdate(row){
  transitForm.formAddr = row.formAddr;
  transitForm.logisticsInfoAddr = row.logisticsInfoAddr;
  dialogVisible.value = true;
}
function handleStop(row){
  transitForm.formAddr = row.formAddr;
  transitForm.logisticsInfoAddr = row.logisticsInfoAddr;
  transitForm.transitAddr = info.address;
  transitForm.transitContact = info.phone
  stopVisible.value = true;
}

// 启动表单
function handleStart(row){
  currentFormAddr.value = row.logisticsInfoAddr;
  startVisible.value = true;
}

// 启动表单提交
const startSubmit = () => {
  const loadingInstance = ElLoading.service({text:"正在启动表单..."});
  startVisible.value = false;
  
  axios.post('/api/startForm', { logisticsInfoAddr: currentFormAddr.value }).then(res => {
    if(res.data.code === '4010'){
      // 刷新列表
      axios.post("/api/getAllForm").then(response => {
        if(response.data.code == '4000'){
          tableData.value = response.data.data;
          loadingInstance.close();
          ElMessage.success("表单已启动！");
        } else {
          loadingInstance.close();
          ElMessage.error("刷新列表失败");
        }
      });
    } else {
      loadingInstance.close();
      ElMessage.error(res.data.message || "启动失败");
    }
  }).catch(err => {
    loadingInstance.close();
    ElMessage.error("服务器错误");
  });
}

const stopSubmit = () => {
  ElMessageBox.confirm('请再次确认您的数据正确无误，一旦更新将存储且不可修改！','提示',{
    confirmButtonText:'确定并提交',
    cancelButtonText:'不，我还需要修改',
    type:"warning",
    showClose:'false',
    beforeClose:(action, instance, done)=>{
      if(action ==='cancel'){
        ElMessage.info("取消")
      };
      done();
    }
  }).then(action=>{
    if(action === 'confirm'){
      const loadingInstance = ElLoading.service({text:"正在更新中"})
      stopVisible.value = false;
      axios.post('/api/changeFormStatus', transitForm).then(res=>{
        if(res.data.code==='4009'){
          axios.post("/api/getAllForm").then(response=>{
            if(response.data.code == '4000'){
              tableData.value = response.data.data;
              loadingInstance.close()
              ElMessage.success("更新成功！")
              emptyForm()
            }else{
              loadingInstance.close();
              ElMessage.error("更新列表时出错！")
            }
          })
        }else{
          loadingInstance.close()
          ElMessage.error("服务器出错了")
        }
      }).catch(err=>{
        // console.log(err)
        loadingInstance.close();
        ElMessage.error("出错了")
      })
    }
  })
    
    
   
}
const updateSubmit = () => {
  ElMessageBox.confirm('请再次确认您的数据正确无误','提示',{
    confirmButtonText:'提交',
    cancelButtonText:'取消',
    type:"warning",
    showClose:'false',
    beforeClose:(action, instance, done)=>{
      if(action ==='cancel'){
        ElMessage.info("取消")
      };
      done();
    }
  }).then(action=>{
    if(action === 'confirm'){
      const loadingInstance = ElLoading.service({text:"正在更新中"})
      dialogVisible.value = false;
      axios.post('/api/updateForm', transitForm).then(res=>{
        if(res.data.code==='4007'){
          axios.post("/api/getAllForm").then(response=>{
            if(response.data.code == '4000'){
              tableData.value = response.data.data;
              loadingInstance.close()
              ElMessage.success("更新成功！")
              emptyForm()
            }else{
              loadingInstance.close();
              ElMessage.error("更新列表时出错！")
            }
          })
        }else{
          loadingInstance.close()
          ElMessage.error("服务器出错了")
        }
      }).catch(err=>{
        // console.log(err)
        loadingInstance.close();
        ElMessage.error("出错了")
      })
    }
  })
    
    
   
}
function get(value){
  window.open("https://www.gds.org.cn/#/barcodeList/index?type=barcode&keyword="+value)
  // console.log(value)
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
  padding: 15px;
  min-height: calc(100vh - 90px);
  box-sizing: border-box;
}

:deep(.el-card) {
  border-radius: 8px;
  border: none;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  height: 100%;
}

:deep(.el-card__header) {
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border-radius: 8px 8px 0 0;
}

.card-header {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

:deep(.el-table) {
  font-size: 13px;
  
  th {
    background: #fafafa !important;
    color: #606266;
    font-weight: 600;
  }
  
  td {
    color: #606266;
  }
  
  .el-table__row:hover > td {
    background: #f5f7fa !important;
  }
}

:deep(.el-table__cell) {
  padding: 12px 0;
}

:deep(.el-pagination) {
  margin-top: 20px;
  justify-content: center;
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

:deep(.el-descriptions) {
  .el-descriptions__label {
    font-weight: 500;
    background: #fafafa;
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

:deep(.el-button--danger) {
  &:not(:disabled) {
    background: #f56c6c;
    border-color: #f56c6c;
  }
}

:deep(.el-dialog) {
  border-radius: 8px;
  
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

p {
  font-size: 14px;
}
</style>

