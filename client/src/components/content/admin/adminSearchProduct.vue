<template>
    <div class="content">
        <!-- 搜索提示 -->
        <div class="search-tips">
            <div class="tip-item">
                <el-icon class="tip-icon"><i-ep-InfoFilled /></el-icon>
                <span>支持商品名称模糊搜索，输入关键词即可查询</span>
            </div>
            <div class="tip-item">
                <el-icon class="tip-icon"><i-ep-Box /></el-icon>
                <span>若商品不在库中，将执行链上查询（需要完整名称）</span>
            </div>
        </div>

        <el-card style="height: 100%;">
            <template #header>
                <div class="card-header">
                    <div class="header-left">
                        <span class="header-title">查询商品</span>
                        <el-text type="info" size="small">搜索库内商品或链上商品信息</el-text>
                    </div>
                    <div class="header-right">
                        <el-tag v-if="isSearching" type="warning" effect="plain">
                            <el-icon><i-ep-Search /></el-icon>
                            搜索结果: {{ tableData.length }} 条
                        </el-tag>
                        <el-tag v-else type="success" effect="plain">
                            <el-icon><i-ep-Box /></el-icon>
                            全部商品: {{ allData.length }} 件
                        </el-tag>
                    </div>
                </div>
            </template>

            <!-- 搜索区域 -->
            <div class="search-area">
                <el-row :gutter="16" align="middle">
                    <el-col :span="14">
                        <el-input 
                            v-model="searchContent.name" 
                            placeholder="请输入商品名称搜索（支持模糊查询）" 
                            size="large"
                            clearable
                            @keyup.enter="search"
                        >
                            <template #prefix>
                                <el-icon><i-ep-Search /></el-icon>
                            </template>
                        </el-input>
                    </el-col>
                    <el-col :span="10">
                        <el-button type="primary" size="large" @click="search" :loading="loading">
                            <el-icon><i-ep-Search /></el-icon>
                            搜索
                        </el-button>
                        <el-button size="large" @click="clear">
                            <el-icon><i-ep-Refresh /></el-icon>
                            显示全部
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
                                        <el-icon><i-ep-Box /></el-icon>
                                        {{ item }}
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

            <!-- 快捷筛选标签 -->
            <div class="quick-filters" v-if="productTypes.length > 0">
                <span class="filter-label">快捷筛选：</span>
                <el-tag 
                    v-for="type in productTypes" 
                    :key="type"
                    :type="activeType === type ? 'primary' : 'info'"
                    :effect="activeType === type ? 'dark' : 'plain'"
                    class="filter-tag"
                    @click="filterByType(type)"
                    style="cursor: pointer;"
                >
                    {{ type }}
                </el-tag>
                <el-tag 
                    v-if="activeType"
                    type="danger"
                    effect="plain"
                    class="filter-tag"
                    @click="clearFilter"
                    style="cursor: pointer;"
                >
                    <el-icon><i-ep-Close /></el-icon>
                    清除筛选
                </el-tag>
            </div>

            <el-divider v-if="tableData.length > 0" />

            <el-table 
                v-loading="loading" 
                element-loading-text="正在查询，请稍后..." 
                :data="paginatedData" 
                style="width: 100%;" 
                stripe
            >
                <el-table-column prop="productName" label="商品名称" width="180" show-overflow-tooltip>
                    <template #default="{ row }">
                        <div class="cell-item">
                            <el-icon><i-ep-Box /></el-icon>
                            {{ row.productName }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="productType" label="商品类别" width="120">
                    <template #default="{ row }">
                        <el-tag size="small" type="info">{{ row.productType }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="productNum" label="数量" width="100" />
                <el-table-column prop="productionDate" label="生产日期" width="180" />
                <el-table-column prop="expirationDate" label="保质期至" width="180">
                    <template #default="{ row }">
                        <el-tag :type="isExpired(row.expirationDate) ? 'danger' : 'success'" size="small">
                            {{ row.expirationDate }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="barcode" label="条码" width="160" show-overflow-tooltip />
                <el-table-column prop="productAddr" label="区块链地址" show-overflow-tooltip>
                    <template #default="{ row }">
                        <el-text type="info" size="small" style="word-break: break-all;">
                            {{ row.productAddr }}
                        </el-text>
                    </template>
                </el-table-column>
                <el-table-column prop="createdAt" label="入库时间" width="180" />

                <template #empty>
                    <el-empty style="user-select: none;" description="暂无数据" />
                </template>
            </el-table>

            <el-pagination
                v-if="tableData.length > 0"
                background
                layout="total, prev, pager, next"
                :total="tableData.length"
                :page-size="pageSize"
                :current-page="currentPage"
                @current-change="handlePageChange"
                style="margin-top: 20px; justify-content: center;"
            />
        </el-card>
    </div>
</template>
<script setup>
import axios from 'axios';
import { aesDecrypt, aesEncrypt } from '../../../utils/utils';
import { ElMessage } from 'element-plus';
import { ref, reactive, computed, onMounted } from 'vue';

const searchContent = reactive({
    name: ""
});
const loading = ref(false);
const tableData = ref([]);
const allData = ref([]);
const searchHistory = ref([]);
const isSearching = ref(false);
const activeType = ref('');
const currentPage = ref(1);
const pageSize = ref(10);

// 商品类别列表
const productTypes = computed(() => {
    const types = [...new Set(allData.value.map(item => item.productType).filter(Boolean))];
    return types;
});

// 分页数据
const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return tableData.value.slice(start, end);
});

// 加载所有商品和搜索历史
onMounted(() => {
    const history = localStorage.getItem('productSearchHistory');
    if (history) {
        searchHistory.value = JSON.parse(history);
    }
    fetchAllData();
});

// 获取所有商品
const fetchAllData = () => {
    loading.value = true;
    axios.get('/api/findAllGoods').then(res => {
        if (res.data.code == '3000') {
            allData.value = res.data.data;
            tableData.value = res.data.data;
        }
        loading.value = false;
    }).catch(err => {
        loading.value = false;
        ElMessage.error("加载商品数据失败");
    });
};

// 保存搜索历史
const saveHistory = (name) => {
    if (!name || searchHistory.value.includes(name)) return;
    searchHistory.value.unshift(name);
    if (searchHistory.value.length > 10) {
        searchHistory.value.pop();
    }
    localStorage.setItem('productSearchHistory', JSON.stringify(searchHistory.value));
};

// 处理历史记录点击
const handleHistoryClick = (command) => {
    if (command === 'clear-history') {
        searchHistory.value = [];
        localStorage.removeItem('productSearchHistory');
        ElMessage.success('搜索历史已清除');
    } else {
        searchContent.name = command;
        search();
    }
};

// 按类别筛选
const filterByType = (type) => {
    activeType.value = type;
    isSearching.value = true;
    tableData.value = allData.value.filter(item => item.productType === type);
    currentPage.value = 1;
};

// 清除筛选
const clearFilter = () => {
    activeType.value = '';
    isSearching.value = false;
    tableData.value = allData.value;
    currentPage.value = 1;
};

// 检查是否过期
const isExpired = (date) => {
    if (!date) return false;
    return new Date(date) < new Date();
};

// 分页
const handlePageChange = (page) => {
    currentPage.value = page;
};

function search() {
    if (!searchContent.name) {
        tableData.value = allData.value;
        isSearching.value = false;
        activeType.value = '';
        return;
    }
    
    // 先在本地数据中搜索
    const keyword = searchContent.name.toLowerCase();
    const localResults = allData.value.filter(item => 
        item.name && item.name.toLowerCase().includes(keyword)
    );
    
    if (localResults.length > 0) {
        tableData.value = localResults;
        isSearching.value = true;
        activeType.value = '';
        currentPage.value = 1;
        saveHistory(searchContent.name);
        ElMessage.success(`找到 ${localResults.length} 条结果`);
    } else {
        // 本地没有，执行链上查询
        loading.value = true;
        let content = {
            data: aesEncrypt(JSON.stringify(searchContent), 'xpxxy')
        };
        axios.post('/api/findOneGoods', content).then(res => {
            if (res.data.code == '3000') {
                tableData.value = [res.data.data];
                isSearching.value = true;
                activeType.value = '';
                currentPage.value = 1;
                saveHistory(searchContent.name);
                ElMessage.success("链上查询成功！");
            }
            if (res.data.code == '3001') {
                tableData.value = [];
                ElMessage.info(res.data.message);
            }
            loading.value = false;
        }).catch(err => {
            loading.value = false;
            ElMessage.error("查询失败，请稍后重试");
        });
    }
}

function clear() {
    tableData.value = allData.value;
    searchContent.name = "";
    isSearching.value = false;
    activeType.value = '';
    currentPage.value = 1;
    ElMessage.success("已恢复显示全部商品！");
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
    margin-bottom: 16px;
    
    :deep(.el-input__wrapper) {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }
    
    :deep(.el-button) {
        margin-right: 8px;
    }
}

.quick-filters {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 8px;
    
    .filter-label {
        color: #909399;
        font-size: 13px;
    }
    
    .filter-tag {
        transition: all 0.3s;
        
        &:hover {
            transform: translateY(-1px);
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

:deep(.el-pagination) {
    justify-content: center;
}
</style>



