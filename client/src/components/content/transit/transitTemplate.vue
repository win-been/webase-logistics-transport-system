<template>
  <div class="content">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">
        <el-icon><i-ep-Document /></el-icon>
        常用模板
      </h2>
      <p class="page-desc">保存常用收发件人信息，快速创建运单</p>
    </div>

    <el-row :gutter="20">
      <!-- 模板列表 -->
      <el-col :span="16">
        <el-card class="main-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <div class="header-left">
                <el-icon><i-ep-Files /></el-icon>
                <span>我的模板</span>
              </div>
              <el-button type="primary" @click="showAddDialog">
                <el-icon><i-ep-Plus /></el-icon>
                新建模板
              </el-button>
            </div>
          </template>

          <div v-if="templates.length > 0" class="template-list">
            <div 
              v-for="(item, index) in templates" 
              :key="index" 
              class="template-item"
            >
              <div class="template-info">
                <div class="template-name">
                  <el-icon><i-ep-Tickets /></el-icon>
                  {{ item.name }}
                </div>
                <div class="template-detail">
                  <span><el-icon><i-ep-User /></el-icon> 收件人: {{ item.receiverName }}</span>
                  <span><el-icon><i-ep-Phone /></el-icon> {{ item.receiverPhone }}</span>
                </div>
                <div class="template-address">
                  <el-icon><i-ep-Location /></el-icon>
                  {{ item.receiverAddress }}
                </div>
              </div>
              <div class="template-actions">
                <el-button type="primary" size="small" @click="useTemplate(item)">
                  <el-icon><i-ep-Select /></el-icon>
                  使用
                </el-button>
                <el-button type="danger" size="small" plain @click="deleteTemplate(index)">
                  <el-icon><i-ep-Delete /></el-icon>
                </el-button>
              </div>
            </div>
          </div>

          <el-empty v-else description="暂无模板，点击右上角新建">
            <el-button type="primary" @click="showAddDialog">新建模板</el-button>
          </el-empty>
        </el-card>
      </el-col>

      <!-- 使用说明 -->
      <el-col :span="8">
        <el-card class="tip-card" shadow="hover">
          <template #header>
            <div class="card-header-simple">
              <el-icon><i-ep-InfoFilled /></el-icon>
              <span>使用说明</span>
            </div>
          </template>
          
          <div class="tips-list">
            <div class="tip-item">
              <el-icon><i-ep-CircleCheck /></el-icon>
              <span>保存常用收件人信息为模板</span>
            </div>
            <div class="tip-item">
              <el-icon><i-ep-CircleCheck /></el-icon>
              <span>创建运单时一键填充收件人</span>
            </div>
            <div class="tip-item">
              <el-icon><i-ep-CircleCheck /></el-icon>
              <span>模板数据保存在本地浏览器</span>
            </div>
            <div class="tip-item">
              <el-icon><i-ep-CircleCheck /></el-icon>
              <span>支持多个模板快速切换</span>
            </div>
          </div>
        </el-card>

        <!-- 快速创建 -->
        <el-card class="action-card" shadow="hover" style="margin-top: 20px;">
          <div class="quick-action" @click="$router.push('/transit/transitcreateform')">
            <el-icon class="action-icon"><i-ep-Edit /></el-icon>
            <div class="action-text">
              <div class="action-title">创建运单</div>
              <div class="action-desc">手动填写运单信息</div>
            </div>
            <el-icon class="arrow-icon"><i-ep-ArrowRight /></el-icon>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 新建模板对话框 -->
    <el-dialog v-model="dialogVisible" title="新建模板" width="500">
      <el-form :model="newTemplate" label-width="100px">
        <el-form-item label="模板名称" required>
          <el-input v-model="newTemplate.name" placeholder="如：公司地址、家庭地址" />
        </el-form-item>
        <el-form-item label="收件人姓名" required>
          <el-input v-model="newTemplate.receiverName" placeholder="请输入收件人姓名" />
        </el-form-item>
        <el-form-item label="收件人电话" required>
          <el-input v-model="newTemplate.receiverPhone" placeholder="请输入收件人电话" />
        </el-form-item>
        <el-form-item label="区块链地址" required>
          <el-input v-model="newTemplate.receiverAddr" placeholder="请输入收件人区块链地址" />
        </el-form-item>
        <el-form-item label="收货地址" required>
          <el-input v-model="newTemplate.receiverAddress" type="textarea" :rows="2" placeholder="请输入详细收货地址" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addTemplate">保存模板</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRouter } from 'vue-router';

const router = useRouter();
const dialogVisible = ref(false);
const templates = ref([]);

const newTemplate = reactive({
  name: '',
  receiverName: '',
  receiverPhone: '',
  receiverAddr: '',
  receiverAddress: ''
});

// 加载模板
const loadTemplates = () => {
  const saved = localStorage.getItem('transitTemplates');
  if (saved) {
    templates.value = JSON.parse(saved);
  }
};

// 保存模板
const saveTemplates = () => {
  localStorage.setItem('transitTemplates', JSON.stringify(templates.value));
};

// 显示添加对话框
const showAddDialog = () => {
  newTemplate.name = '';
  newTemplate.receiverName = '';
  newTemplate.receiverPhone = '';
  newTemplate.receiverAddr = '';
  newTemplate.receiverAddress = '';
  dialogVisible.value = true;
};

// 添加模板
const addTemplate = () => {
  if (!newTemplate.name || !newTemplate.receiverName || !newTemplate.receiverPhone || !newTemplate.receiverAddr) {
    ElMessage.warning('请填写完整信息');
    return;
  }
  
  templates.value.push({ ...newTemplate });
  saveTemplates();
  dialogVisible.value = false;
  ElMessage.success('模板保存成功');
};

// 使用模板
const useTemplate = (template) => {
  // 将模板数据存到sessionStorage，创建表单页面可以读取
  sessionStorage.setItem('selectedTemplate', JSON.stringify(template));
  ElMessage.success('已选择模板，正在跳转到创建运单页面');
  router.push('/transit/transitcreateform');
};

// 删除模板
const deleteTemplate = (index) => {
  ElMessageBox.confirm('确定要删除这个模板吗？', '提示', {
    type: 'warning'
  }).then(() => {
    templates.value.splice(index, 1);
    saveTemplates();
    ElMessage.success('删除成功');
  }).catch(() => {});
};

onMounted(() => {
  loadTemplates();
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
  }
}

.template-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.template-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #f8f9fa;
  border-radius: 10px;
  transition: all 0.3s;
  
  &:hover {
    background: #f0f5ff;
    transform: translateX(4px);
  }
  
  .template-info {
    flex: 1;
    
    .template-name {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 16px;
      font-weight: 600;
      color: #303133;
      margin-bottom: 8px;
      
      .el-icon {
        color: #667eea;
      }
    }
    
    .template-detail {
      display: flex;
      gap: 20px;
      font-size: 13px;
      color: #606266;
      margin-bottom: 6px;
      
      span {
        display: flex;
        align-items: center;
        gap: 4px;
      }
    }
    
    .template-address {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 13px;
      color: #909399;
    }
  }
  
  .template-actions {
    display: flex;
    gap: 8px;
  }
}

.tip-card {
  border-radius: 12px;
  border: none;
  
  .card-header-simple {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    font-weight: 500;
    color: #303133;
    
    .el-icon {
      color: #667eea;
    }
  }
  
  .tips-list {
    .tip-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 0;
      font-size: 14px;
      color: #606266;
      
      .el-icon {
        color: #67c23a;
      }
    }
  }
}

.action-card {
  border-radius: 12px;
  border: none;
  cursor: pointer;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
  }
  
  .quick-action {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 8px;
    
    .action-icon {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 24px;
    }
    
    .action-text {
      flex: 1;
      
      .action-title {
        font-size: 16px;
        font-weight: 600;
        color: #303133;
      }
      
      .action-desc {
        font-size: 13px;
        color: #909399;
        margin-top: 4px;
      }
    }
    
    .arrow-icon {
      color: #c0c4cc;
      font-size: 20px;
    }
  }
}
</style>

