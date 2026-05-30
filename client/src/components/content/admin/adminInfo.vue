<template>
  <div class="dashboard">
    <!-- 欢迎区域 -->
    <div class="welcome-card">
      <div class="welcome-left">
        <div class="avatar">
          <img :src="avatarUrl" alt="avatar" />
        </div>
        <div class="welcome-text">
          <h1>欢迎回来，{{ userInfo.name || userInfo.userID }}</h1>
          <p>{{ currentTime }}</p>
        </div>
      </div>
      <div class="welcome-stats">
        <div class="stat-item">
          <el-icon><i-ep-Document /></el-icon>
          <div class="stat-text">
            <span class="stat-label">我的角色</span>
            <span class="stat-value">{{ userInfo.role === 'admin' ? '管理员' : userInfo.role }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 快捷操作 -->
    <div class="section-title">快捷操作</div>
    <div class="quick-actions">
      <div class="action-card" @click="$router.push('/admin/admincreateform')">
        <div class="action-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
          <el-icon><i-ep-Edit /></el-icon>
        </div>
        <div class="action-info">
          <h3>创建运单</h3>
          <p>新建物流运单</p>
        </div>
        <el-icon class="action-arrow"><i-ep-ArrowRight /></el-icon>
      </div>
      <div class="action-card" @click="$router.push('/admin/admincreateproduct')">
        <div class="action-icon" style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);">
          <el-icon><i-ep-Plus /></el-icon>
        </div>
        <div class="action-info">
          <h3>商品入库</h3>
          <p>添加新商品信息</p>
        </div>
        <el-icon class="action-arrow"><i-ep-ArrowRight /></el-icon>
      </div>
      <div class="action-card" @click="$router.push('/admin/adminallformlist')">
        <div class="action-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
          <el-icon><i-ep-List /></el-icon>
        </div>
        <div class="action-info">
          <h3>查看运单</h3>
          <p>管理所有运单</p>
        </div>
        <el-icon class="action-arrow"><i-ep-ArrowRight /></el-icon>
      </div>
      <div class="action-card" @click="$router.push('/admin/adminallproducts')">
        <div class="action-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
          <el-icon><i-ep-Box /></el-icon>
        </div>
        <div class="action-info">
          <h3>查看商品</h3>
          <p>浏览商品列表</p>
        </div>
        <el-icon class="action-arrow"><i-ep-ArrowRight /></el-icon>
      </div>
    </div>

    <!-- 数据统计 -->
    <div class="section-title">数据概览</div>
    <div class="stats-cards">
      <div class="stats-card">
        <div class="stats-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
          <el-icon><i-ep-Document /></el-icon>
        </div>
        <div class="stats-info">
          <span class="stats-value">{{ stats.formCount }}</span>
          <span class="stats-label">运单总数</span>
        </div>
      </div>
      <div class="stats-card">
        <div class="stats-icon" style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);">
          <el-icon><i-ep-Box /></el-icon>
        </div>
        <div class="stats-info">
          <span class="stats-value">{{ stats.productCount }}</span>
          <span class="stats-label">商品总数</span>
        </div>
      </div>
      <div class="stats-card">
        <div class="stats-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
          <el-icon><i-ep-User /></el-icon>
        </div>
        <div class="stats-info">
          <span class="stats-value">{{ stats.userCount }}</span>
          <span class="stats-label">用户总数</span>
        </div>
      </div>
      <div class="stats-card">
        <div class="stats-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
          <el-icon><i-ep-TrendCharts /></el-icon>
        </div>
        <div class="stats-info">
          <span class="stats-value">{{ stats.activeCount }}</span>
          <span class="stats-label">进行中运单</span>
        </div>
      </div>
    </div>

    <!-- 个人信息和系统信息 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <div class="section-title">个人信息</div>
        <el-card class="info-card" shadow="never">
          <div class="info-grid">
            <div class="info-item">
              <div class="info-icon"><el-icon><i-ep-User /></el-icon></div>
              <div class="info-content">
                <label>用户名</label>
                <span>{{ userInfo.userID }}</span>
              </div>
            </div>
            <div class="info-item">
              <div class="info-icon"><el-icon><i-ep-Avatar /></el-icon></div>
              <div class="info-content">
                <label>真实姓名</label>
                <span>{{ userInfo.name }}</span>
              </div>
            </div>
            <div class="info-item">
              <div class="info-icon"><el-icon><i-ep-Phone /></el-icon></div>
              <div class="info-content">
                <label>手机号</label>
                <span>{{ userInfo.phone }}</span>
              </div>
            </div>
            <div class="info-item">
              <div class="info-icon"><el-icon><i-ep-Calendar /></el-icon></div>
              <div class="info-content">
                <label>注册时间</label>
                <span>{{ userInfo.createdAt }}</span>
              </div>
            </div>
          </div>
          <div class="address-item">
            <div class="info-icon"><el-icon><i-ep-Link /></el-icon></div>
            <div class="info-content">
              <label>区块链地址</label>
              <span class="address">{{ userInfo.address }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <div class="section-title">系统信息</div>
        <el-card class="system-card" shadow="never">
          <div class="system-info">
            <div class="system-item">
              <span class="label">系统名称</span>
              <span class="value">区块链物流表单系统</span>
            </div>
            <div class="system-item">
              <span class="label">区块链平台</span>
              <el-tag size="small" type="primary">FISCO BCOS</el-tag>
            </div>
            <div class="system-item">
              <span class="label">当前版本</span>
              <el-tag size="small">v1.0.0</el-tag>
            </div>
            <div class="system-item">
              <span class="label">技术栈</span>
              <span class="value">Vue3 + Vite + Element Plus</span>
            </div>
            <div class="system-item">
              <span class="label">后端技术</span>
              <span class="value">Node.js + Express + Sequelize</span>
            </div>
            <div class="system-item">
              <span class="label">数据库</span>
              <span class="value">MySQL</span>
            </div>
          </div>
          <div class="feature-list">
            <div class="feature-item">
              <el-icon><i-ep-SuccessFilled /></el-icon>
              <span>数据不可篡改</span>
            </div>
            <div class="feature-item">
              <el-icon><i-ep-SuccessFilled /></el-icon>
              <span>全流程可追溯</span>
            </div>
            <div class="feature-item">
              <el-icon><i-ep-SuccessFilled /></el-icon>
              <span>链上存证</span>
            </div>
            <div class="feature-item">
              <el-icon><i-ep-SuccessFilled /></el-icon>
              <span>多角色管理</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 账户安全和最近活动 -->
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <div class="section-title">账户安全</div>
        <el-card class="security-card" shadow="never">
          <div class="security-item">
            <div class="security-left">
              <el-icon class="security-icon" style="color: #67c23a;"><i-ep-CircleCheckFilled /></el-icon>
              <div class="security-info">
                <h4>登录密码</h4>
                <p>已设置，建议定期更换密码</p>
              </div>
            </div>
            <el-button type="primary" link @click="showPasswordDialog = true">修改</el-button>
          </div>
          <div class="security-item">
            <div class="security-left">
              <el-icon class="security-icon" style="color: #67c23a;"><i-ep-CircleCheckFilled /></el-icon>
              <div class="security-info">
                <h4>手机绑定</h4>
                <p>已绑定手机：{{ maskPhone(userInfo.phone) }}</p>
              </div>
            </div>
            <el-button type="primary" link @click="showPhoneDialog = true">更换</el-button>
          </div>
          <div class="security-item">
            <div class="security-left">
              <el-icon class="security-icon" style="color: #67c23a;"><i-ep-CircleCheckFilled /></el-icon>
              <div class="security-info">
                <h4>区块链身份</h4>
                <p>已绑定链上地址</p>
              </div>
            </div>
            <el-tag type="success" size="small">已认证</el-tag>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <div class="section-title">最近活动</div>
        <el-card class="activity-card" shadow="never">
          <el-timeline>
            <el-timeline-item
              v-for="(activity, index) in recentActivities"
              :key="index"
              :type="activity.type"
              :timestamp="activity.time"
              placement="top"
            >
              {{ activity.content }}
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
    </el-row>

    <!-- 修改密码对话框 -->
    <el-dialog v-model="showPasswordDialog" title="修改密码" width="420px" :close-on-click-modal="false">
      <el-form :model="passwordForm" :rules="passwordRules" ref="passwordFormRef" label-width="80px">
        <el-form-item label="原密码" prop="oldPassword">
          <el-input v-model="passwordForm.oldPassword" type="password" show-password placeholder="请输入原密码" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="passwordForm.newPassword" type="password" show-password placeholder="请输入新密码" />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="passwordForm.confirmPassword" type="password" show-password placeholder="请再次输入新密码" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showPasswordDialog = false">取消</el-button>
        <el-button type="primary" @click="handleChangePassword" :loading="passwordLoading">确认修改</el-button>
      </template>
    </el-dialog>

    <!-- 更换手机对话框 -->
    <el-dialog v-model="showPhoneDialog" title="更换手机号" width="420px" :close-on-click-modal="false">
      <el-form :model="phoneForm" :rules="phoneRules" ref="phoneFormRef" label-width="80px">
        <el-form-item label="原手机号">
          <el-input :value="maskPhone(userInfo.phone)" disabled />
        </el-form-item>
        <el-form-item label="新手机号" prop="newPhone">
          <el-input v-model="phoneForm.newPhone" placeholder="请输入新手机号" maxlength="11" />
        </el-form-item>
        <el-form-item label="登录密码" prop="password">
          <el-input v-model="phoneForm.password" type="password" show-password placeholder="请输入登录密码验证身份" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showPhoneDialog = false">取消</el-button>
        <el-button type="primary" @click="handleChangePhone" :loading="phoneLoading">确认更换</el-button>
      </template>
    </el-dialog>

    <!-- 登录信息 -->
    <div class="section-title" style="margin-top: 20px;">登录信息</div>
    <el-card class="login-info-card" shadow="never">
      <el-row :gutter="40">
        <el-col :span="6">
          <div class="login-stat">
            <div class="login-stat-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
              <el-icon><i-ep-Monitor /></el-icon>
            </div>
            <div class="login-stat-info">
              <span class="login-stat-value">{{ loginInfo.lastLoginTime }}</span>
              <span class="login-stat-label">上次登录时间</span>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="login-stat">
            <div class="login-stat-icon" style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);">
              <el-icon><i-ep-Location /></el-icon>
            </div>
            <div class="login-stat-info">
              <span class="login-stat-value">{{ loginInfo.lastLoginIp }}</span>
              <span class="login-stat-label">上次登录IP</span>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="login-stat">
            <div class="login-stat-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
              <el-icon><i-ep-Timer /></el-icon>
            </div>
            <div class="login-stat-info">
              <span class="login-stat-value">{{ loginInfo.onlineDuration }}</span>
              <span class="login-stat-label">本次在线时长</span>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="login-stat">
            <div class="login-stat-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
              <el-icon><i-ep-Checked /></el-icon>
            </div>
            <div class="login-stat-info">
              <span class="login-stat-value">{{ loginInfo.loginCount }}</span>
              <span class="login-stat-label">累计登录次数</span>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import { aesDecrypt, aesEncrypt } from "../../../utils/utils";
import { ElMessage } from "element-plus";
import axios from "axios";

const info = JSON.parse(
  aesDecrypt(localStorage.getItem("userSession"), "xpxxy")
);

// 对话框控制
const showPasswordDialog = ref(false);
const showPhoneDialog = ref(false);
const passwordLoading = ref(false);
const phoneLoading = ref(false);
const passwordFormRef = ref(null);
const phoneFormRef = ref(null);

// 修改密码表单
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
});

// 更换手机表单
const phoneForm = reactive({
  newPhone: '',
  password: ''
});

// 密码验证规则
const validateConfirmPassword = (rule, value, callback) => {
  if (value !== passwordForm.newPassword) {
    callback(new Error('两次输入的密码不一致'));
  } else {
    callback();
  }
};

const passwordRules = {
  oldPassword: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
};

const phoneRules = {
  newPhone: [
    { required: true, message: '请输入新手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  password: [{ required: true, message: '请输入登录密码', trigger: 'blur' }]
};

// 修改密码
const handleChangePassword = async () => {
  if (!passwordFormRef.value) return;
  
  try {
    const valid = await passwordFormRef.value.validate();
    if (!valid) return;
    
    passwordLoading.value = true;
    const res = await axios.post('/api/changePassword', {
      userID: userInfo.userID,
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword
    });
    
    if (res.data.code === '2000') {
      ElMessage.success('密码修改成功');
      showPasswordDialog.value = false;
      // 重置表单
      passwordForm.oldPassword = '';
      passwordForm.newPassword = '';
      passwordForm.confirmPassword = '';
    } else {
      ElMessage.error(res.data.message || '密码修改失败');
    }
  } catch (err) {
    console.error('修改密码错误:', err);
    if (err.message !== 'validate failed') {
      ElMessage.error('密码修改失败，请检查原密码是否正确');
    }
  } finally {
    passwordLoading.value = false;
  }
};

// 更换手机号
const handleChangePhone = async () => {
  if (!phoneFormRef.value) {
    console.log('phoneFormRef is null');
    return;
  }
  
  try {
    const valid = await phoneFormRef.value.validate();
    if (!valid) return;
    
    phoneLoading.value = true;
    console.log('发送请求:', { userID: userInfo.userID, newPhone: phoneForm.newPhone });
    
    const res = await axios.post('/api/changePhone', {
      userID: userInfo.userID,
      newPhone: phoneForm.newPhone,
      password: phoneForm.password
    });
    
    console.log('响应:', res.data);
    
    if (res.data.code === '2000') {
      ElMessage.success('手机号更换成功');
      showPhoneDialog.value = false;
      // 更新本地显示
      userInfo.phone = phoneForm.newPhone;
      // 更新localStorage
      info.phone = phoneForm.newPhone;
      localStorage.setItem('userSession', aesEncrypt(JSON.stringify(info), 'xpxxy'));
      // 重置表单
      phoneForm.newPhone = '';
      phoneForm.password = '';
    } else {
      ElMessage.error(res.data.message || '手机号更换失败');
    }
  } catch (err) {
    console.error('更换手机号错误:', err);
    if (err.response) {
      ElMessage.error(err.response.data?.message || '手机号更换失败');
    } else if (err.message !== 'validate failed') {
      ElMessage.error('手机号更换失败，请检查密码是否正确');
    }
  } finally {
    phoneLoading.value = false;
  }
};

const userInfo = reactive({
  userID: "",
  name: "",
  phone: "",
  role: "",
  address: "",
  createdAt: "",
});

const stats = reactive({
  formCount: 0,
  productCount: 0,
  userCount: 0,
  activeCount: 0,
});

// 最近活动记录
const recentActivities = ref([
  { content: '登录系统', time: '今天 19:30', type: 'primary' },
  { content: '查看运单列表', time: '今天 18:45', type: 'success' },
  { content: '创建新运单', time: '昨天 16:20', type: 'warning' },
  { content: '商品入库操作', time: '昨天 14:10', type: 'info' },
  { content: '修改用户信息', time: '3天前', type: '' },
]);

// 登录信息
const loginInfo = reactive({
  lastLoginTime: new Date().toLocaleString('zh-CN'),
  lastLoginIp: '本地登录',
  onlineDuration: '0分钟',
  loginCount: parseInt(localStorage.getItem('loginCount') || '0') + 1,
});

// 保存登录次数
if (!sessionStorage.getItem('currentSessionCounted')) {
  localStorage.setItem('loginCount', String(loginInfo.loginCount));
  sessionStorage.setItem('currentSessionCounted', 'true');
}

// 登录时间记录（保存到sessionStorage，刷新页面也不会重置）
const getLoginStartTime = () => {
  let startTime = sessionStorage.getItem('loginStartTime');
  if (!startTime) {
    startTime = Date.now().toString();
    sessionStorage.setItem('loginStartTime', startTime);
  }
  return parseInt(startTime);
};
const loginStartTime = ref(getLoginStartTime());

// 手机号脱敏
const maskPhone = (phone) => {
  if (!phone) return '未绑定';
  const phoneStr = String(phone);
  if (phoneStr.length >= 11) {
    return phoneStr.substring(0, 3) + '****' + phoneStr.substring(7);
  }
  return phoneStr;
};

// 更新在线时长
const updateOnlineDuration = () => {
  const now = Date.now();
  const durationSeconds = Math.floor((now - loginStartTime.value) / 1000);
  const durationMinutes = Math.floor(durationSeconds / 60);
  
  if (durationSeconds < 60) {
    loginInfo.onlineDuration = `${durationSeconds}秒`;
  } else if (durationMinutes < 60) {
    const secs = durationSeconds % 60;
    loginInfo.onlineDuration = `${durationMinutes}分${secs}秒`;
  } else {
    const hours = Math.floor(durationMinutes / 60);
    const mins = durationMinutes % 60;
    loginInfo.onlineDuration = `${hours}小时${mins}分钟`;
  }
};

const avatarUrl = computed(() => {
  return `https://ui-avatars.com/api/?background=667eea&color=fff&rounded=true&size=80&name=${userInfo.userID || 'Admin'}`;
});

const currentTime = computed(() => {
  const now = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
  return now.toLocaleDateString('zh-CN', options);
});

// 获取统计数据
const fetchStats = async () => {
  try {
    // 获取运单数量 (POST请求)
    const formRes = await axios.post("/api/getAllForm");
    if (formRes.data && formRes.data.data) {
      stats.formCount = formRes.data.data.length;
      stats.activeCount = formRes.data.data.filter(f => f.status === 'on').length;
    }
    
    // 获取商品数量
    const productRes = await axios.get("/api/findAllGoods");
    if (productRes.data && productRes.data.data) {
      stats.productCount = productRes.data.data.length;
    }
    
    // 获取用户数量
    const userRes = await axios.get("/api/getAllUser");
    if (userRes.data && userRes.data.data) {
      stats.userCount = userRes.data.data.length;
    }
  } catch (err) {
    console.log("获取统计数据失败", err);
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
  
  // 每秒更新在线时长（更实时）
  updateOnlineDuration();
  setInterval(updateOnlineDuration, 1000);
});
</script>

<style scoped lang="less">
.dashboard {
  padding: 20px;
  min-height: calc(100vh - 90px);
  box-sizing: border-box;
}

.welcome-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 30px;
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 10px 40px rgba(102, 126, 234, 0.3);
}

.welcome-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.avatar {
  img {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    border: 3px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }
}

.welcome-text {
  h1 {
    color: #fff;
    font-size: 26px;
    margin: 0 0 8px 0;
    font-weight: 600;
  }
  
  p {
    color: rgba(255, 255, 255, 0.8);
    margin: 0;
    font-size: 14px;
  }
}

.welcome-stats {
  .stat-item {
    display: flex;
    align-items: center;
    gap: 12px;
    background: rgba(255, 255, 255, 0.15);
    padding: 12px 20px;
    border-radius: 10px;
    
    .el-icon {
      font-size: 24px;
      color: #fff;
    }
    
    .stat-text {
      display: flex;
      flex-direction: column;
      
      .stat-label {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.7);
      }
      
      .stat-value {
        font-size: 16px;
        color: #fff;
        font-weight: 600;
      }
    }
  }
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
  padding-left: 10px;
  border-left: 3px solid #667eea;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stats-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  }
}

.stats-icon {
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

.stats-info {
  display: flex;
  flex-direction: column;
  
  .stats-value {
    font-size: 28px;
    font-weight: 700;
    color: #303133;
    line-height: 1.2;
  }
  
  .stats-label {
    font-size: 13px;
    color: #909399;
    margin-top: 4px;
  }
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.action-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
  }
}

.action-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .el-icon {
    font-size: 24px;
    color: #fff;
  }
}

.action-info {
  flex: 1;
  
  h3 {
    margin: 0 0 4px 0;
    font-size: 15px;
    color: #303133;
    font-weight: 600;
  }
  
  p {
    margin: 0;
    font-size: 12px;
    color: #909399;
  }
}

.action-arrow {
  color: #c0c4cc;
  font-size: 16px;
}

.info-card, .system-card {
  border-radius: 12px;
  border: none;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  
  :deep(.el-card__body) {
    padding: 20px;
  }
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.info-icon {
  width: 36px;
  height: 36px;
  background: #f0f2f5;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .el-icon {
    font-size: 18px;
    color: #667eea;
  }
}

.info-content {
  label {
    display: block;
    font-size: 12px;
    color: #909399;
    margin-bottom: 4px;
  }
  
  span {
    font-size: 14px;
    color: #303133;
    font-weight: 500;
  }
}

.address-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
  
  .address {
    font-size: 12px;
    word-break: break-all;
    color: #667eea;
    font-family: monospace;
  }
}

.system-info {
  margin-bottom: 20px;
  
  .system-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #f5f5f5;
    
    &:last-child {
      border-bottom: none;
    }
    
    .label {
      color: #909399;
      font-size: 14px;
    }
    
    .value {
      color: #303133;
      font-size: 14px;
      font-weight: 500;
    }
  }
}

.feature-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
  
  .feature-item {
    display: flex;
    align-items: center;
    gap: 6px;
    background: #f0fdf4;
    padding: 6px 12px;
    border-radius: 20px;
    
    .el-icon {
      color: #22c55e;
      font-size: 14px;
    }
    
    span {
      color: #166534;
      font-size: 12px;
    }
  }
}

// 账户安全卡片
.security-card, .activity-card, .login-info-card {
  border-radius: 12px;
  border: none;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  
  :deep(.el-card__body) {
    padding: 20px;
  }
}

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

.security-icon {
  font-size: 24px;
}

.security-info {
  h4 {
    margin: 0 0 4px 0;
    font-size: 14px;
    color: #303133;
    font-weight: 600;
  }
  
  p {
    margin: 0;
    font-size: 12px;
    color: #909399;
  }
}

// 最近活动
.activity-card {
  :deep(.el-timeline) {
    padding-left: 0;
  }
  
  :deep(.el-timeline-item__wrapper) {
    padding-left: 20px;
  }
  
  :deep(.el-timeline-item__timestamp) {
    font-size: 12px;
  }
}

// 登录信息
.login-stat {
  display: flex;
  align-items: center;
  gap: 16px;
}

.login-stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .el-icon {
    font-size: 24px;
    color: #fff;
  }
}

.login-stat-info {
  display: flex;
  flex-direction: column;
  
  .login-stat-value {
    font-size: 14px;
    font-weight: 600;
    color: #303133;
  }
  
  .login-stat-label {
    font-size: 12px;
    color: #909399;
    margin-top: 4px;
  }
}
</style>

