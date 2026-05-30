<template>
  <div class="content">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">
        <el-icon><i-ep-Edit /></el-icon>
        修改个人信息
      </h2>
      <p class="page-desc">您只能修改密码，其他信息请联系管理员</p>
    </div>

    <el-row :gutter="20">
      <!-- 左侧头像卡片 -->
      <el-col :span="8">
        <el-card class="avatar-card" shadow="hover">
          <div class="avatar-section">
            <el-avatar :size="100" class="user-avatar">
              {{ userInfo.name?.charAt(0) || 'U' }}
            </el-avatar>
            <h3 class="user-name">{{ userInfo.name || '用户' }}</h3>
            <el-tag type="success" effect="dark" round>普通用户</el-tag>
          </div>
          <div class="tips-section">
            <div class="tip-item warning">
              <el-icon><i-ep-WarningFilled /></el-icon>
              <span>修改密码后需要重新登录</span>
            </div>
            <div class="tip-item">
              <el-icon><i-ep-Lock /></el-icon>
              <span>仅可修改登录密码</span>
            </div>
            <div class="tip-item">
              <el-icon><i-ep-InfoFilled /></el-icon>
              <span>灰色字段不可编辑</span>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 右侧表单卡片 -->
      <el-col :span="16">
        <el-card class="form-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <el-icon><i-ep-EditPen /></el-icon>
              <span>修改密码</span>
            </div>
          </template>
          
          <el-form :model="userInfo" label-width="100px" class="edit-form">
            <el-form-item label="手机号">
              <el-input v-model="userInfo.phone" disabled>
                <template #prefix>
                  <el-icon><i-ep-Phone /></el-icon>
                </template>
              </el-input>
              <span class="field-hint">不可修改</span>
            </el-form-item>
            
            <el-form-item label="用户名">
              <el-input v-model="userInfo.userID" disabled>
                <template #prefix>
                  <el-icon><i-ep-User /></el-icon>
                </template>
              </el-input>
              <span class="field-hint">不可修改</span>
            </el-form-item>
            
            <el-form-item label="新密码">
              <el-input v-model="userInfo.pw" show-password placeholder="请输入新密码">
                <template #prefix>
                  <el-icon><i-ep-Lock /></el-icon>
                </template>
              </el-input>
            </el-form-item>
            
            <el-form-item label="真实姓名">
              <el-input v-model="userInfo.name" disabled>
                <template #prefix>
                  <el-icon><i-ep-UserFilled /></el-icon>
                </template>
              </el-input>
              <span class="field-hint">不可修改</span>
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="change" class="submit-btn">
                <el-icon><i-ep-Check /></el-icon>
                保存密码
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios';
import { aesDecrypt } from '@/utils/utils.js';
import { useRouter } from "vue-router";
import { ElLoading, ElMessage } from "element-plus";

const router = useRouter();
const info = JSON.parse(aesDecrypt(localStorage.getItem('userSession'), 'xpxxy'));

const userInfo = reactive({
  userID: '',
  pw: '',
  name: '',
  phone: '',
  status: '',
  createdAt: ''
});

onMounted(() => {
  userInfo.userID = info.userID;
  userInfo.pw = info.pw;
  userInfo.name = info.name;
  userInfo.phone = info.phone;
  userInfo.status = info.status;
});

function change() {
  if (userInfo.pw.length === 0) {
    ElMessage.error("密码不能为空！");
    return;
  }
  
  const loadingInstance = ElLoading.service({ text: "正在更新中" });
  
  axios.post("/api/changeInfo", userInfo).then(res => {
    if (res.data.code === '2000') {
      axios.post("/api/logout");
      loadingInstance.close();
      ElMessage.success("修改成功！请重新登录");
      localStorage.removeItem('userSession');
      router.push("/login");
    } else {
      loadingInstance.close();
      ElMessage.error("修改失败");
    }
  }).catch(() => {
    loadingInstance.close();
    ElMessage.error("服务器错误");
  });
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
      color: #10b981;
    }
  }
  
  .page-desc {
    color: #909399;
    font-size: 14px;
    margin: 0;
  }
}

.avatar-card {
  border-radius: 12px;
  border: none;
  
  :deep(.el-card__body) {
    padding: 32px 24px;
  }
  
  .avatar-section {
    text-align: center;
    padding-bottom: 24px;
    border-bottom: 1px solid #f0f0f0;
    
    .user-avatar {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      font-size: 36px;
      font-weight: 600;
      margin-bottom: 16px;
    }
    
    .user-name {
      font-size: 20px;
      font-weight: 600;
      color: #303133;
      margin: 0 0 12px 0;
    }
  }
  
  .tips-section {
    padding-top: 20px;
    
    .tip-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 0;
      font-size: 13px;
      color: #909399;
      
      .el-icon {
        color: #10b981;
      }
      
      &.warning .el-icon {
        color: #e6a23c;
      }
    }
  }
}

.form-card {
  border-radius: 12px;
  border: none;
  
  :deep(.el-card__header) {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    border-radius: 12px 12px 0 0;
    padding: 16px 24px;
  }
  
  .card-header {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #fff;
    font-size: 16px;
    font-weight: 500;
  }
  
  .edit-form {
    padding: 20px 0;
    
    :deep(.el-form-item) {
      margin-bottom: 24px;
      position: relative;
    }
    
    :deep(.el-input) {
      .el-input__wrapper {
        border-radius: 8px;
        padding: 4px 12px;
      }
    }
    
    .field-hint {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      font-size: 12px;
      color: #c0c4cc;
    }
    
    .submit-btn {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      border: none;
      border-radius: 8px;
      padding: 10px 24px;
    }
  }
}
</style>
