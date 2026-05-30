<template>
    <div class="header">
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" :ellipsis="false">
            <el-menu-item index="0">
                <img style="width: 60px" src="@/assets/logo.png" alt="Delivery logo" />
                <div class="mainTitle">区块链物流表单系统</div>
            </el-menu-item>

            <div class="flex-grow" />

            <el-menu-item index="1" @click="toMainPage">
                <el-icon>
                    <i-ep-HomeFilled />
                </el-icon>
                返回首页
            </el-menu-item>
            <el-sub-menu index="2" class="user-menu">
                <template #title>
                    <div class="user-avatar-wrapper">
                        <el-avatar :size="36" :src="avatarUrl" class="user-avatar">
                            {{ info.userName?.charAt(0) || 'U' }}
                        </el-avatar>
                    </div>
                </template>
                <div class="user-info-header">
                    <el-avatar :size="50" :src="avatarUrl" class="header-avatar">
                        {{ info.userName?.charAt(0) || 'U' }}
                    </el-avatar>
                    <div class="user-details">
                        <span class="user-name">{{ info.userName || '用户' }}</span>
                        <span class="user-role">{{ getRoleName() }}</span>
                    </div>
                </div>
                <el-divider style="margin: 8px 0;" />
                <el-menu-item index="2-1" @click="goToProfile">
                    <el-icon><i-ep-User /></el-icon>
                    个人信息
                </el-menu-item>
                <el-menu-item index="2-2" @click="showAvatarDialog = true">
                    <el-icon><i-ep-Camera /></el-icon>
                    更换头像
                </el-menu-item>
                <el-menu-item index="2-3" @click="goToSettings">
                    <el-icon><i-ep-Setting /></el-icon>
                    个人设置
                </el-menu-item>
                <el-divider style="margin: 8px 0;" />
                <el-popconfirm title="是否退出登录" confirm-button-text="是的" cancel-button-text="不" :icon="InfoFilled"
                    icon-color="#626AEF" @confirm="quit">
                    <template #reference>
                        <el-menu-item index="2-4" class="logout-item">
                            <el-icon><i-ep-SwitchButton /></el-icon>
                            退出登录
                        </el-menu-item>
                    </template>
                </el-popconfirm>
            </el-sub-menu>
        </el-menu>
    </div>

    <!-- 更换头像对话框 -->
    <el-dialog v-model="showAvatarDialog" title="更换头像" width="480px" :close-on-click-modal="false">
        <div class="avatar-dialog-content">
            <div class="current-avatar">
                <el-avatar :size="100" :src="avatarUrl" class="preview-avatar">
                    {{ info.userName?.charAt(0) || 'U' }}
                </el-avatar>
                <p>当前头像</p>
            </div>
            <el-divider direction="vertical" style="height: 120px;" />
            <div class="avatar-options">
                <p class="options-title">选择预设头像</p>
                <div class="preset-avatars">
                    <el-avatar 
                        v-for="(avatar, index) in presetAvatars" 
                        :key="index"
                        :size="50" 
                        :src="avatar"
                        class="preset-avatar"
                        :class="{ 'selected': selectedAvatar === avatar }"
                        @click="selectedAvatar = avatar"
                    />
                </div>
                <p class="options-title" style="margin-top: 16px;">或输入自定义头像URL</p>
                <el-input v-model="customAvatarUrl" placeholder="输入图片URL地址" clearable>
                    <template #prefix>
                        <el-icon><i-ep-Link /></el-icon>
                    </template>
                </el-input>
            </div>
        </div>
        <template #footer>
            <el-button @click="showAvatarDialog = false">取消</el-button>
            <el-button type="primary" @click="saveAvatar">保存头像</el-button>
        </template>
    </el-dialog>

    <div class="main-container">
        <div class="sidebar">
            <div class="navtitle">
                业务中心
            </div>
            <el-menu text-color="white" background-color="#001428" :unique-opened="true" class="sidebar-menu">
                <template v-for="item of menu">
                    <template v-if="item.submenu.length === 0">
                        <el-menu-item :index="item.path" @click="handleRoute(item.path)">
                            <el-icon>
                                <component :is="item.icon"></component>
                            </el-icon>
                            <span>{{ item.title }}</span>
                        </el-menu-item>
                    </template>
                    <template v-else>
                        <el-sub-menu :index="item.path">
                            <template #title>
                                <el-icon>
                                    <component :is="item.icon"></component>
                                </el-icon>
                                <span>{{ item.title }}</span>
                            </template>
                            <template v-for="subitem of item.submenu">
                                <el-menu-item :index="subitem.path" @click="handleRoute(subitem.path)">
                                    <el-icon>
                                        <component :is="subitem.icon"></component>
                                    </el-icon>
                                    <span>{{ subitem.title }}</span>
                                </el-menu-item>
                            </template>
                        </el-sub-menu>
                    </template>
                </template>
            </el-menu>
        </div>
        <div class="main-content">
            <RouterView />
        </div>
    </div>

</template>
<script setup>
import { aesDecrypt, aesEncrypt } from '../../utils/utils';
import { RouterView } from 'vue-router';
import { ref, reactive, onBeforeMount, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { InfoFilled } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import axios from 'axios';

const router = useRouter();
const route = useRoute();

// 用户信息
const info = JSON.parse(aesDecrypt(localStorage.getItem('userSession'), 'xpxxy'));

// 头像相关
const showAvatarDialog = ref(false);
const selectedAvatar = ref('');
const customAvatarUrl = ref('');
const avatarUrl = ref('');

// 预设头像列表
const presetAvatars = [
    'https://ui-avatars.com/api/?background=667eea&color=fff&rounded=true&size=128&name=' + (info.userName || 'U'),
    'https://ui-avatars.com/api/?background=10b981&color=fff&rounded=true&size=128&name=' + (info.userName || 'U'),
    'https://ui-avatars.com/api/?background=f59e0b&color=fff&rounded=true&size=128&name=' + (info.userName || 'U'),
    'https://ui-avatars.com/api/?background=ef4444&color=fff&rounded=true&size=128&name=' + (info.userName || 'U'),
    'https://ui-avatars.com/api/?background=8b5cf6&color=fff&rounded=true&size=128&name=' + (info.userName || 'U'),
    'https://ui-avatars.com/api/?background=06b6d4&color=fff&rounded=true&size=128&name=' + (info.userName || 'U'),
];

// 初始化头像
onMounted(() => {
    const savedAvatar = localStorage.getItem('userAvatar');
    if (savedAvatar) {
        avatarUrl.value = savedAvatar;
    } else {
        avatarUrl.value = presetAvatars[0];
    }
});

// 获取角色名称
const getRoleName = () => {
    const role = route.meta?.role;
    const roleMap = {
        'admin': '管理员',
        'user': '普通用户',
        'transit': '中转方'
    };
    return roleMap[role] || '用户';
};

// 跳转到个人信息
const goToProfile = () => {
    const role = route.meta?.role;
    if (role === 'admin') {
        router.push('/admin/admininfo');
    } else if (role === 'transit') {
        router.push('/transit/transitinfo');
    } else {
        router.push('/user/userinfo');
    }
};

// 跳转到个人设置
const goToSettings = () => {
    const role = route.meta?.role;
    if (role === 'admin') {
        router.push('/admin/admininfo');
    } else if (role === 'transit') {
        router.push('/transit/transitchangeinfo');
    } else {
        router.push('/user/userchangeinfo');
    }
};

// 保存头像
const saveAvatar = () => {
    const newAvatar = customAvatarUrl.value || selectedAvatar.value;
    if (!newAvatar) {
        ElMessage.warning('请选择或输入头像');
        return;
    }
    avatarUrl.value = newAvatar;
    localStorage.setItem('userAvatar', newAvatar);
    showAvatarDialog.value = false;
    selectedAvatar.value = '';
    customAvatarUrl.value = '';
    ElMessage.success('头像更换成功！');
};

const activeIndex = ref('0');
let menu = [];

onBeforeMount(() => {
    menu = route.meta.menu;
});

const handleRoute = (routePath) => {
    router.push(routePath);
};

const toMainPage = () => {
    router.push('/');
};

function quit() {
    axios.post('/api/logout').then(res => {
        if (res.data.code === '2006') {
            localStorage.removeItem('userSession');
            ElMessage.success('退出登录成功！');
            router.push('/');
        }
    });
}
</script>
<style lang="less" scoped>
.header {
    .el-menu-demo {
        border-bottom: none;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        padding: 0 20px;
    }
    
    .mainTitle {
        font-size: 18px;
        font-weight: 600;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }
}

.flex-grow {
    flex-grow: 1;
}

.main-container {
    display: flex;
    height: calc(100vh - 60px);
    overflow: hidden;
}

.sidebar {
    width: 200px;
    min-width: 200px;
    background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
    display: flex;
    flex-direction: column;
    height: 100%;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
}

.sidebar-menu {
    flex: 1;
    border-right: none !important;
    overflow-y: auto;
    background: transparent !important;
    
    :deep(.el-menu-item) {
        margin: 4px 8px;
        border-radius: 8px;
        transition: all 0.3s;
        
        &:hover {
            background: rgba(255, 255, 255, 0.1) !important;
        }
        
        &.is-active {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
            color: #fff !important;
        }
    }
    
    :deep(.el-sub-menu) {
        .el-sub-menu__title {
            margin: 4px 8px;
            border-radius: 8px;
            
            &:hover {
                background: rgba(255, 255, 255, 0.1) !important;
            }
        }
        
        .el-menu-item {
            padding-left: 50px !important;
            margin: 2px 8px;
        }
    }
}

.main-content {
    flex: 1;
    overflow-y: auto;
    background: #f0f2f5;
}

.navtitle {
    padding: 20px 16px;
    text-align: left;
    font-weight: 600;
    font-size: 13px;
    background: rgba(255, 255, 255, 0.05);
    color: rgba(255, 255, 255, 0.9);
    letter-spacing: 2px;
    text-transform: uppercase;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.el-menu-item {
    font-weight: 500;
    font-size: 14px;
}

.el-sub-menu {
    :deep(.el-sub-menu__title) {
        font-weight: 500;
    }
}

.title {
    text-align: center;
}

// 用户头像菜单样式
.user-menu {
    .user-avatar-wrapper {
        display: flex;
        align-items: center;
        
        .user-avatar {
            cursor: pointer;
            border: 2px solid #fff;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
            transition: transform 0.3s;
            
            &:hover {
                transform: scale(1.05);
            }
        }
    }
}

.user-info-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    margin: -5px -5px 0 -5px;
    border-radius: 4px 4px 0 0;
    
    .header-avatar {
        border: 2px solid rgba(255, 255, 255, 0.5);
    }
    
    .user-details {
        display: flex;
        flex-direction: column;
        gap: 4px;
        
        .user-name {
            font-size: 16px;
            font-weight: 600;
            color: #fff;
        }
        
        .user-role {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.8);
            background: rgba(255, 255, 255, 0.2);
            padding: 2px 8px;
            border-radius: 10px;
        }
    }
}

.logout-item {
    color: #f56c6c !important;
    
    &:hover {
        background: #fef0f0 !important;
    }
}

// 头像对话框样式
.avatar-dialog-content {
    display: flex;
    align-items: flex-start;
    gap: 24px;
    padding: 20px 0;
    
    .current-avatar {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        
        .preview-avatar {
            border: 3px solid #667eea;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }
        
        p {
            color: #909399;
            font-size: 13px;
            margin: 0;
        }
    }
    
    .avatar-options {
        flex: 1;
        
        .options-title {
            font-size: 13px;
            color: #606266;
            margin: 0 0 12px 0;
        }
        
        .preset-avatars {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            
            .preset-avatar {
                cursor: pointer;
                border: 2px solid transparent;
                transition: all 0.3s;
                
                &:hover {
                    transform: scale(1.1);
                }
                
                &.selected {
                    border-color: #667eea;
                    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.3);
                }
            }
        }
    }
}
</style>
