<template>
    <div class="content">
        <!-- 页面标题 -->
        <div class="page-header">
            <div class="header-left">
                <h2 class="page-title">
                    <el-icon><i-ep-Search /></el-icon>
                    商品查询
                </h2>
                <p class="page-desc">通过商品名称搜索商品信息，支持模糊查询</p>
            </div>
        </div>

        <!-- 搜索卡片 -->
        <el-card class="search-card" shadow="hover">
            <div class="search-wrapper">
                <el-input 
                    v-model="searchContent.name" 
                    placeholder="请输入商品名称，支持模糊查询库内商品"
                    size="large"
                    clearable
                    @keyup.enter="search"
                >
                    <template #prefix>
                        <el-icon><i-ep-Search /></el-icon>
                    </template>
                </el-input>
                <el-button type="primary" size="large" @click="search" :loading="loading">
                    <el-icon><i-ep-Search /></el-icon>
                    搜索商品
                </el-button>
                <el-button size="large" @click="clear">
                    <el-icon><i-ep-Delete /></el-icon>
                    清除结果
                </el-button>
            </div>
            <div class="search-tips">
                <el-icon><i-ep-InfoFilled /></el-icon>
                <span>提示：若库中不存在可能需要执行链上查询，这可能需要数秒完成</span>
            </div>
        </el-card>

        <!-- 结果卡片 -->
        <el-card class="result-card" shadow="hover">
            <template #header>
                <div class="card-header">
                    <div class="header-left">
                        <el-icon><i-ep-List /></el-icon>
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
                element-loading-text="正在查询中..." 
                :data="tableData" 
                style="width: 100%;" 
                :max-height="500" 
                stripe 
                :border="false"
                class="custom-table"
            >
                <el-table-column prop="productName" label="商品名称" min-width="140">
                    <template #default={row}>
                        <div class="product-name">
                            <el-icon><i-ep-Goods /></el-icon>
                            <span>{{ row.productName }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="productType" label="类别" width="100">
                    <template #default={row}>
                        <el-tag size="small">{{ row.productType }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="productionDate" label="生产日期" width="120" />
                <el-table-column prop="expirationDate" label="保质期" width="120" />
                <el-table-column prop="barcode" label="条形码" width="140">
                    <template #default={row}>
                        <el-button type="primary" link size="small">
                            <el-icon><i-ep-Postcard /></el-icon>
                            {{ row.barcode }}
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="productAddr" label="商品区块链地址" min-width="200">
                    <template #default={row}>
                        <el-tooltip :content="row.productAddr" placement="top">
                            <span class="address-text">{{ row.productAddr?.slice(0, 12) }}...{{ row.productAddr?.slice(-10) }}</span>
                        </el-tooltip>
                    </template>
                </el-table-column>

                <template #empty>
                    <el-empty description="暂无查询结果，请输入商品名称进行搜索" />
                </template>
            </el-table>
        </el-card>
    </div>
</template>
<script setup>
import axios from 'axios';
import { aesDecrypt, aesEncrypt} from '@/utils/utils.js';
import { ElMessage } from 'element-plus';
import { ref, watch, reactive } from 'vue';

const searchContent = reactive({
    name: ""
})
const loading = ref(false)
const tableData = ref([])
function search() {
    loading.value = true;
    let content = {
        data:aesEncrypt(JSON.stringify(searchContent),'xpxxy')
    }
    axios.post('/api/findOneGoods', content).then(res => {
        if (res.data.code == '3000') {
            loading.value = false;
            tableData.value.push(res.data.data)
            ElMessage.success("查询成功！")
            // console.log(tableData)
        }
        if(res.data.code == '3001'){
            loading.value = false;
            ElMessage.info(res.data.message)
        }
    }).catch(err=>{
        loading.value = false;
        ElMessage.error("出错了，请联系管理员")
    })
}
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
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding: 20px 24px;
    background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(17, 153, 142, 0.3);
}

.page-title {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #fff;
    font-size: 22px;
    margin: 0;
    
    .el-icon {
        font-size: 26px;
    }
}

.page-desc {
    color: rgba(255, 255, 255, 0.85);
    margin: 8px 0 0 0;
    font-size: 14px;
}

.search-card {
    border-radius: 12px;
    border: none;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    margin-bottom: 20px;
    
    :deep(.el-card__body) {
        padding: 24px;
    }
}

.search-wrapper {
    display: flex;
    gap: 12px;
    align-items: center;
    
    .el-input {
        flex: 1;
        
        :deep(.el-input__wrapper) {
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }
    }
}

.search-tips {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 16px;
    padding: 12px 16px;
    background: #f0f9ff;
    border-radius: 8px;
    border-left: 3px solid #0ea5e9;
    color: #0369a1;
    font-size: 13px;
    
    .el-icon {
        font-size: 16px;
    }
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
        
        .el-icon {
            color: #11998e;
        }
    }
}

.custom-table {
    :deep(th) {
        background: #fafafa !important;
        color: #606266;
        font-weight: 600;
    }
}

.product-name {
    display: flex;
    align-items: center;
    gap: 8px;
    
    .el-icon {
        color: #11998e;
    }
}

.address-text {
    font-family: monospace;
    font-size: 12px;
    color: #909399;
    cursor: pointer;
    
    &:hover {
        color: #11998e;
    }
}
</style>
