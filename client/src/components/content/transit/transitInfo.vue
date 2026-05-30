<template>
  <div class="content">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">
        <el-icon><i-ep-User /></el-icon>
        个人信息
      </h2>
      <p class="page-desc">查看您的账户信息和区块链地址</p>
    </div>

    <!-- 用户头像卡片 -->
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="profile-card" shadow="hover">
          <div class="avatar-section">
            <el-avatar :size="100" class="user-avatar">
              {{ userInfo.name?.charAt(0) || 'U' }}
            </el-avatar>
            <h3 class="user-name">{{ userInfo.name || '用户' }}</h3>
            <el-tag type="primary" effect="dark" round>{{ getRoleLabel(userInfo.role) }}</el-tag>
          </div>
          <div class="stats-section">
            <div class="stat-item">
              <el-icon class="stat-icon"><i-ep-Calendar /></el-icon>
              <div class="stat-info">
                <span class="stat-label">注册时间</span>
                <span class="stat-value">{{ userInfo.createdAt }}</span>
              </div>
            </div>
          </div>
          <!-- 快捷操作 -->
          <div class="quick-actions">
            <el-button type="primary" @click="$router.push('/transit/transitchangeinfo')" class="action-btn">
              <el-icon><i-ep-Edit /></el-icon>
              修改信息
            </el-button>
          </div>
        </el-card>
      </el-col>

      <!-- 详细信息卡片 -->
      <el-col :span="16">
        <el-card class="info-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <el-icon><i-ep-InfoFilled /></el-icon>
              <span>账户详情</span>
            </div>
          </template>
          <div class="info-list">
            <div class="info-item">
              <div class="info-icon">
                <el-icon><i-ep-User /></el-icon>
              </div>
              <div class="info-content">
                <span class="info-label">用户名</span>
                <span class="info-value">{{ userInfo.userID }}</span>
              </div>
            </div>
            <div class="info-item">
              <div class="info-icon">
                <el-icon><i-ep-UserFilled /></el-icon>
              </div>
              <div class="info-content">
                <span class="info-label">真实姓名</span>
                <span class="info-value">{{ userInfo.name }}</span>
              </div>
            </div>
            <div class="info-item">
              <div class="info-icon">
                <el-icon><i-ep-Phone /></el-icon>
              </div>
              <div class="info-content">
                <span class="info-label">手机号码</span>
                <span class="info-value">{{ userInfo.phone }}</span>
              </div>
            </div>
            <div class="info-item">
              <div class="info-icon blockchain">
                <el-icon><i-ep-Link /></el-icon>
              </div>
              <div class="info-content">
                <span class="info-label">区块链地址</span>
                <span class="info-value address">{{ userInfo.address }}</span>
                <el-button size="small" text type="primary" @click="copyAddress">
                  <el-icon><i-ep-CopyDocument /></el-icon>
                  复制
                </el-button>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 第二行：账户安全 + 工作统计 -->
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <el-card class="security-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <el-icon><i-ep-Lock /></el-icon>
              <span>账户安全</span>
            </div>
          </template>
          <div class="security-list">
            <div class="security-item">
              <div class="security-left">
                <el-icon class="status-icon success"><i-ep-CircleCheckFilled /></el-icon>
                <div class="security-info">
                  <span class="security-title">登录密码</span>
                  <span class="security-desc">已设置，安全等级高</span>
                </div>
              </div>
              <el-button text type="primary" size="small" @click="$router.push('/transit/transitchangeinfo')">修改</el-button>
            </div>
            <div class="security-item">
              <div class="security-left">
                <el-icon class="status-icon success"><i-ep-CircleCheckFilled /></el-icon>
                <div class="security-info">
                  <span class="security-title">手机绑定</span>
                  <span class="security-desc">已绑定：{{ maskPhone(userInfo.phone) }}</span>
                </div>
              </div>
              <el-tag type="success" size="small">已验证</el-tag>
            </div>
            <div class="security-item">
              <div class="security-left">
                <el-icon class="status-icon success"><i-ep-CircleCheckFilled /></el-icon>
                <div class="security-info">
                  <span class="security-title">区块链身份</span>
                  <span class="security-desc">已绑定链上地址</span>
                </div>
              </div>
              <el-tag type="primary" size="small">已认证</el-tag>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="stats-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <el-icon><i-ep-DataAnalysis /></el-icon>
              <span>工作统计</span>
            </div>
          </template>
          <div class="work-stats">
            <div class="work-stat-item">
              <div class="work-stat-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                <el-icon><i-ep-Document /></el-icon>
              </div>
              <div class="work-stat-info">
                <span class="work-stat-value">{{ stats.totalForms }}</span>
                <span class="work-stat-label">参与运单</span>
              </div>
            </div>
            <div class="work-stat-item">
              <div class="work-stat-icon" style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);">
                <el-icon><i-ep-Check /></el-icon>
              </div>
              <div class="work-stat-info">
                <span class="work-stat-value">{{ stats.completedForms }}</span>
                <span class="work-stat-label">已完成</span>
              </div>
            </div>
            <div class="work-stat-item">
              <div class="work-stat-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
                <el-icon><i-ep-Timer /></el-icon>
              </div>
              <div class="work-stat-info">
                <span class="work-stat-value">{{ stats.pendingForms }}</span>
                <span class="work-stat-label">进行中</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted } from "vue";
import { aesDecrypt } from "../../../utils/utils";
import { ElMessage } from "element-plus";
import axios from "axios";

const info = JSON.parse(
  aesDecrypt(localStorage.getItem("userSession"), "xpxxy")
);

const userInfo = reactive({
  userID: "",
  name: "",
  phone: "",
  role: "",
  address: "",
  createdAt: "",
});

const stats = reactive({
  totalForms: 0,
  completedForms: 0,
  pendingForms: 0
});

const getRoleLabel = (role) => {
  const roleMap = {
    'user': '普通用户',
    'transit': '中转方',
    'admin': '管理员'
  };
  return roleMap[role] || role;
};

const maskPhone = (phone) => {
  if (!phone) return '未绑定';
  const phoneStr = String(phone);
  if (phoneStr.length >= 11) {
    return phoneStr.substring(0, 3) + '****' + phoneStr.substring(7);
  }
  return phoneStr;
};

const copyAddress = () => {
  navigator.clipboard.writeText(userInfo.address);
  ElMessage.success('地址已复制到剪贴板');
};

const fetchStats = async () => {
  try {
    const res = await axios.post('/api/getTransitForm', { userAddr: info.address });
    if (res.data && res.data.data) {
      const forms = res.data.data;
      stats.totalForms = forms.length;
      stats.completedForms = forms.filter(f => f.status === 'off').length;
      stats.pendingForms = forms.filter(f => f.status === 'on').length;
    }
  } catch (err) {
    console.log('获取统计失败', err);
  }
};

onMounted(() => {
  userInfo.userID = info.userID;
  userInfo.name = info.name;
  userInfo.phone = info.phone;
  userInfo.role = info.role;
  userInfo.address = info.address;
  userInfo.createdAt = info.createdAt.slice(0, -14);
  
  fetchStats();
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

.profile-card {
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
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
  
  .stats-section {
    padding-top: 20px;
    
    .stat-item {
      display: flex;
      align-items: center;
      gap: 12px;
      
      .stat-icon {
        font-size: 20px;
        color: #667eea;
      }
      
      .stat-info {
        display: flex;
        flex-direction: column;
        
        .stat-label {
          font-size: 12px;
          color: #909399;
        }
        
        .stat-value {
          font-size: 14px;
          color: #303133;
          font-weight: 500;
        }
      }
    }
  }
}

.info-card {
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
    gap: 8px;
    color: #fff;
    font-size: 16px;
    font-weight: 500;
  }
  
  .info-list {
    .info-item {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      padding: 20px 0;
      border-bottom: 1px solid #f5f5f5;
      
      &:last-child {
        border-bottom: none;
      }
      
      .info-icon {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        background: linear-gradient(135deg, #e8ecff 0%, #f3e8ff 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        
        .el-icon {
          font-size: 18px;
          color: #667eea;
        }
        
        &.blockchain {
          background: linear-gradient(135deg, #e6fffb 0%, #e8f4ff 100%);
          
          .el-icon {
            color: #13c2c2;
          }
        }
      }
      
      .info-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 4px;
        
        .info-label {
          font-size: 12px;
          color: #909399;
        }
        
        .info-value {
          font-size: 15px;
          color: #303133;
          font-weight: 500;
          
          &.address {
            font-family: monospace;
            font-size: 13px;
            word-break: break-all;
            color: #667eea;
          }
        }
      }
    }
  }
}

// 快捷操作
.quick-actions {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
  
  .action-btn {
    width: 100%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    border-radius: 8px;
    height: 40px;
  }
}

// 账户安全卡片
.security-card, .stats-card {
  border-radius: 12px;
  border: none;
  
  :deep(.el-card__header) {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 12px 12px 0 0;
    padding: 14px 20px;
  }
  
  .card-header {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #fff;
    font-size: 15px;
    font-weight: 500;
  }
}

.security-list {
  .security-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 0;
    border-bottom: 1px solid #f5f5f5;
    
    &:last-child {
      border-bottom: none;
    }
  }
  
  .security-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .status-icon {
    font-size: 22px;
    
    &.success {
      color: #67c23a;
    }
  }
  
  .security-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    
    .security-title {
      font-size: 14px;
      color: #303133;
      font-weight: 500;
    }
    
    .security-desc {
      font-size: 12px;
      color: #909399;
    }
  }
}

// 工作统计
.work-stats {
  display: flex;
  justify-content: space-around;
  padding: 16px 0;
}

.work-stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.work-stat-icon {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .el-icon {
    font-size: 26px;
    color: #fff;
  }
}

.work-stat-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  
  .work-stat-value {
    font-size: 28px;
    font-weight: 700;
    color: #303133;
  }
  
  .work-stat-label {
    font-size: 13px;
    color: #909399;
    margin-top: 2px;
  }
}
</style>
