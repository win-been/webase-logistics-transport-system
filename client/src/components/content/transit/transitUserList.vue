<template>
  <div class="content">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">
        <el-icon><i-ep-User /></el-icon>
        用户通讯录
      </h2>
      <p class="page-desc">查看系统用户的区块链地址和联系方式，方便创建运单时填写收件人信息</p>
    </div>

    <el-card class="main-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <el-icon><i-ep-Notebook /></el-icon>
            <span>用户列表</span>
          </div>
          <div class="header-right">
            <el-input
              v-model="searchKeyword"
              placeholder="搜索用户名/地址/电话"
              style="width: 250px"
              clearable
              @input="handleSearch"
            >
              <template #prefix>
                <el-icon><i-ep-Search /></el-icon>
              </template>
            </el-input>
          </div>
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="filteredUsers"
        style="width: 100%"
        :max-height="600"
        stripe
        :border="false"
        class="custom-table"
      >
        <template #empty>
          <el-empty description="暂无用户数据" />
        </template>
        
        <el-table-column type="index" label="#" width="60" />
        
        <el-table-column prop="userID" label="用户名" width="180">
          <template #default="{ row }">
            <div class="user-info">
              <span class="username">{{ row.userID }}</span>
              <el-tag v-if="row.name" size="small" type="info">{{ row.name }}</el-tag>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column prop="address" label="区块链地址" min-width="200">
          <template #default="{ row }">
            <div class="address-cell">
              <el-tooltip :content="row.address" placement="top">
                <span class="address-text">{{ row.address }}</span>
              </el-tooltip>
              <el-button 
                type="primary" 
                link 
                size="small"
                @click="copyAddress(row.address)"
              >
                <el-icon><i-ep-CopyDocument /></el-icon>
              </el-button>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column prop="phone" label="联系电话" width="150">
          <template #default="{ row }">
            <div class="phone-cell">
              <el-icon><i-ep-Phone /></el-icon>
              <span>{{ row.phone }}</span>
              <el-button 
                type="primary" 
                link 
                size="small"
                @click="copyPhone(row.phone)"
              >
                <el-icon><i-ep-CopyDocument /></el-icon>
              </el-button>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column prop="role" label="用户类型" width="120">
          <template #default="{ row }">
            <el-tag v-if="row.role === 'user'" type="success">普通用户</el-tag>
            <el-tag v-else-if="row.role === 'transit'" type="warning">中转方</el-tag>
            <el-tag v-else type="info">{{ row.role }}</el-tag>
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button 
              type="primary" 
              size="small"
              @click="useAsReceiver(row)"
            >
              <el-icon><i-ep-Select /></el-icon>
              选为收件人
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrapper">
        <el-pagination
          background
          layout="total, prev, pager, next"
          :total="totalUsers"
          :page-size="pageSize"
          :current-page="currentPage"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 快速使用对话框 -->
    <el-dialog v-model="dialogVisible" title="收件人信息" width="500">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="用户名">{{ selectedUser.userID }} <el-tag v-if="selectedUser.name" size="small">{{ selectedUser.name }}</el-tag></el-descriptions-item>
        <el-descriptions-item label="区块链地址">
          <div class="dialog-address">
            <span>{{ selectedUser.address }}</span>
            <el-button type="primary" link @click="copyAddress(selectedUser.address)">
              <el-icon><i-ep-CopyDocument /></el-icon>
              复制
            </el-button>
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="联系电话">
          <div class="dialog-phone">
            <span>{{ selectedUser.phone }}</span>
            <el-button type="primary" link @click="copyPhone(selectedUser.phone)">
              <el-icon><i-ep-CopyDocument /></el-icon>
              复制
            </el-button>
          </div>
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="dialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="goToCreateForm">
          <el-icon><i-ep-Edit /></el-icon>
          去创建运单
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';

const router = useRouter();
const loading = ref(false);
const userList = ref([]);
const searchKeyword = ref('');
const currentPage = ref(1);
const pageSize = ref(10);
const dialogVisible = ref(false);
const selectedUser = ref({});

// 获取用户列表
const fetchUsers = async () => {
  loading.value = true;
  try {
    const res = await axios.get('/api/getAllUser');
    if (res.data.code === '2000') {
      userList.value = res.data.data || [];
    } else {
      ElMessage.error(res.data.message || '获取用户列表失败');
    }
  } catch (error) {
    console.error(error);
    ElMessage.error('获取用户列表失败');
  } finally {
    loading.value = false;
  }
};

// 搜索过滤
const filteredUsers = computed(() => {
  let result = userList.value;
  
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase();
    result = result.filter(user => 
      user.userID?.toLowerCase().includes(keyword) ||
      user.name?.toLowerCase().includes(keyword) ||
      user.address?.toLowerCase().includes(keyword) ||
      user.phone?.includes(keyword)
    );
  }
  
  // 分页
  const start = (currentPage.value - 1) * pageSize.value;
  return result.slice(start, start + pageSize.value);
});

const totalUsers = computed(() => {
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase();
    return userList.value.filter(user => 
      user.username?.toLowerCase().includes(keyword) ||
      user.address?.toLowerCase().includes(keyword) ||
      user.phone?.includes(keyword)
    ).length;
  }
  return userList.value.length;
});

// 复制地址
const copyAddress = async (address) => {
  try {
    await navigator.clipboard.writeText(address);
    ElMessage.success('区块链地址已复制');
  } catch (error) {
    ElMessage.error('复制失败');
  }
};

// 复制电话
const copyPhone = async (phone) => {
  try {
    await navigator.clipboard.writeText(phone);
    ElMessage.success('电话号码已复制');
  } catch (error) {
    ElMessage.error('复制失败');
  }
};

// 选为收件人
const useAsReceiver = (user) => {
  selectedUser.value = user;
  dialogVisible.value = true;
};

// 跳转到创建表单
const goToCreateForm = () => {
  // 保存选中的收件人到sessionStorage
  sessionStorage.setItem('selectedRecipient', JSON.stringify(selectedUser.value));
  dialogVisible.value = false;
  ElMessage.success('已选择收件人，正在跳转...');
  router.push('/transit/transitcreateform');
};

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1;
};

// 分页处理
const handleCurrentChange = (page) => {
  currentPage.value = page;
};

onMounted(() => {
  fetchUsers();
});
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
    
    .header-right {
      :deep(.el-input__wrapper) {
        background: rgba(255, 255, 255, 0.9);
      }
    }
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

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  
  .username {
    font-weight: 500;
    color: #303133;
  }
}

.address-cell {
  display: flex;
  align-items: center;
  gap: 8px;
  
  .address-text {
    font-family: 'Courier New', monospace;
    font-size: 13px;
    color: #606266;
    max-width: 180px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.phone-cell {
  display: flex;
  align-items: center;
  gap: 6px;
  
  .el-icon {
    color: #909399;
  }
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  padding: 16px 0;
}

.dialog-address,
.dialog-phone {
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  span {
    word-break: break-all;
  }
}
</style>

