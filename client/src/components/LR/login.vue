<template>
    <div class="body">
        <div class="header">
            <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" :ellipsis="false">
                <el-menu-item index="0">
                    <img style="width: 60px" src="@/assets/logo.png" alt="Delivery logo" />
                    <div class="mainTitle">区块链物流表单系统</div>
                </el-menu-item>

                <div class="flex-grow" />

                <el-menu-item index="1" @click="toMainPage">
                    <el-icon>
                        <!-- icon需要这样引入 -->
                        <i-ep-HomeFilled />
                    </el-icon>
                    返回首页
                </el-menu-item>
                <el-menu-item index="2" @click="toAdminLogin">
                    <el-icon>
                        <i-ep-Tools />
                    </el-icon>
                    管理员登录
                </el-menu-item>
            </el-menu>
        </div>
        <div class="content">
            <div class="contentBody">
                <el-form ref="ruleFormRef" :model="ruleForm" label-width="auto" style="max-width: 600px;" :rules="rules"
                    label-position="left" status-icon hide-required-asterisk>
                    <el-form-item>
                        <img style="width: 100px" src="@/assets/logo.png" alt="Delivery logo" />
                    </el-form-item>
                    <el-form-item label="手机号" prop="phone">
                        <el-input id="phone" placeholder="您的手机号" maxlength="11" v-model="ruleForm.phone">
                            <template #prefix>
                                <el-icon class="el-input__icon">
                                    <i-ep-Iphone />
                                </el-icon>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="pw">
                        <el-input id="pw" placeholder="您的密码" show-password v-model="ruleForm.pw">
                            <template #prefix>
                                <el-icon class="el-input__icon">
                                    <i-ep-Lock />
                                </el-icon>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="验证码" prop="captcha">
                        <div class="captcha-wrapper">
                            <el-input id="captcha" placeholder="验证码 不区分大小写" maxlength="4" v-model="ruleForm.captcha" style="width: 180px;">
                                <template #prefix>
                                    <el-icon class="el-input__icon">
                                        <i-ep-Lock />
                                    </el-icon>
                                </template>
                            </el-input>
                            <el-tooltip effect="light" content="看不清？点击刷新！" placement="right-start">
                                <div class="captchabox" @click="flushCaptcha" v-html="captcha.src"></div>
                            </el-tooltip>
                        </div>
                    </el-form-item>
                    <el-form-item class="button">
                        <el-button v-loading.fullscreen.lock="fullscreenLoading" @click="submit()" type="primary">
                            <template #icon>
                                <el-icon><i-ep-CircleCheck /></el-icon>
                            </template>
                            登录
                        </el-button>
                    </el-form-item>
                    <el-form-item @click="toRegister">
                        没有账号？点击注册!
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>




</template>
<script setup>
import { ref, reactive, onBeforeMount} from 'vue'
import { aesDecrypt } from '@/utils/utils';
import axios from 'axios'
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus'
const router = useRouter()
const activeIndex = ref('0')
const ruleForm = reactive({
    phone:'',
    pw:'',
    captcha:''
})
const ruleFormRef = ref()
const captcha = reactive({
    src:""
})
const rules = reactive({
    phone:[
        { required: true, message: "请输入手机号", trigger: 'blur' },
        { pattern: /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/, message: "请输入正确的手机号", trigger: 'blur'},
        { len:11, message:"请输入正确的手机号", trigger: 'blur'}
    ],
    pw:[
        { required: true, message:"请输入密码", trigger:'blur' },
        { min:6,max:20, message:"密码的长度在6-20位之间", trigger:'blur'}
    ]
})
const toAdminLogin=()=>{
    router.push('/adminlogin')
}
const toMainPage=()=>{
    router.push('/')
}
const flushCaptcha=()=>{
    axios.get("/api/captcha").then(res=>{
        captcha.src = res.data.data
        // console.log(res.data);
    })
    
    
}
onBeforeMount(()=>{
    flushCaptcha()
})

const fullscreenLoading = ref(false)
function submit(){
    //设置加载遮罩
    fullscreenLoading.value = true
    ruleFormRef.value.validate((valid) => {
        if(valid){
            var options = {
                method: 'post',
                headers: { "content-type": "application/json" },
                data: ruleForm,
                url: '/api/login',
            }
            axios(options).then(res => {
                let data = res.data
                if (data.code == '2000') {
                    localStorage.setItem('userSession', data.data)
                    let info = JSON.parse(aesDecrypt(data.data,'xpxxy'))
                    // console.log(info)
                    
                    if(info.role =='user'){
                        fullscreenLoading.value = false
                        ElMessage.success("登陆成功！") 
                        router.push('/user') 
                    }
                    if(info.role == 'transit'){
                        fullscreenLoading.value = false
                        ElMessage.success("登陆成功！") 
                        router.push('/transit')
                    }
                    if(info.role == 'admin'){
                        fullscreenLoading.value = false
                        ElMessage.info("请管理员使用管理员登录，不要使用用户页面操作。")
                    }
                }
                if (data.code == '2002'){
                    fullscreenLoading.value = false
                    ElMessage.error("密码错误！")
                    
                }
                if(data.code == '2005'){
                    fullscreenLoading.value = false
                    ElMessage.error("验证码错误！")
                }
            }).catch(err=>{
                fullscreenLoading.value = false
                ElMessage.error('登录失败，服务器开小差了')
            })
        }else{
            fullscreenLoading.value = false;
            ElMessage.info('您的表单完成了吗？')
        }
    })
    //!不要使用axios发json的get 草你妈测半天
    
}
const toRegister=()=>{
    router.push('/register')
}
</script>
<style scoped lang="less">
.el-row {
  margin-bottom: 20px;
  text-align: center;
}

.body {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

.body::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("@/assets/loginbg.jpg") no-repeat center center;
  background-size: cover;
  opacity: 0.3;
  z-index: 0;
}

.header {
  position: relative;
  z-index: 10;
}

.header .el-menu-demo {
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  border: none;
}

.mainTitle {
  font-size: 20px;
  font-weight: bold;
  color: #303133;
}

.flex-grow {
  flex-grow: 1;
}

.content {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 120px);
  padding: 40px 20px;
  position: relative;
  z-index: 1;
}

.contentBody {
  width: 420px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 50px 40px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.contentBody :deep(.el-form-item) {
  margin-bottom: 25px;
}

.contentBody :deep(.el-form-item__label) {
  font-weight: 500;
  color: #606266;
}

.contentBody :deep(.el-input__wrapper) {
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 8px 15px;
  transition: all 0.3s;
}

.contentBody :deep(.el-input__wrapper:hover) {
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.2);
}

.contentBody :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
}

.contentBody :deep(.el-button--primary) {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
  transition: all 0.3s;
}

.contentBody :deep(.el-button--primary:hover) {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(102, 126, 234, 0.5);
}

.contentBody :deep(.el-form-item__content) {
  justify-content: center;
}

.contentBody :deep(.el-form-item:first-child) {
  text-align: center;
  margin-bottom: 30px;
}

.contentBody :deep(.el-form-item:last-child) {
  text-align: center;
  color: #667eea;
  cursor: pointer;
  font-size: 14px;
  margin-top: 20px;
  transition: color 0.3s;
}

.contentBody :deep(.el-form-item:last-child:hover) {
  color: #764ba2;
}

.captcha-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
}

.captchabox {
  height: 40px;
  min-width: 110px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  background: #f5f7fa;
  border: 1px solid #dcdfe6;
}

.captchabox:hover {
  opacity: 0.8;
}

.captchabox :deep(svg) {
  width: 100px;
  height: 36px;
}
</style>

