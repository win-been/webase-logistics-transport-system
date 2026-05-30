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
                <el-menu-item index="2" @click="toLogin">
                    <el-icon>
                        <i-ep-ArrowLeftBold />
                    </el-icon>
                    返回登录
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
                    <el-form-item label="您的用户名" prop="userID">
                        <el-input id="userID" placeholder="请输入您的用户名" v-model="ruleForm.userID">
                            <template #prefix>
                                <el-icon class="el-input__icon">
                                    <i-ep-User />
                                </el-icon>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="您的姓名" prop="name">
                        <el-input id="name" placeholder="请输入您的姓名" v-model="ruleForm.name">
                            <template #prefix>
                                <el-icon class="el-input__icon">
                                    <i-ep-User />
                                </el-icon>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="您的手机号" prop="phone">
                        <el-input id="phone" placeholder="请输入您的手机号" v-model="ruleForm.phone">
                            <template #prefix>
                                <el-icon class="el-input__icon">
                                    <i-ep-Iphone />
                                </el-icon>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="您的密码" prop="pw">
                        <el-input id="pw" placeholder="请输入您的密码6-20位，可以包含特殊字符" v-model="ruleForm.pw">
                            <template #prefix>
                                <el-icon class="el-input__icon">
                                    <i-ep-Lock />
                                </el-icon>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="您的角色" prop="role">
                            <el-radio-group id="role" v-model="ruleForm.role" size="default">
                                        <el-radio-button  value="user">
                                            <el-icon>
                                                <i-ep-Avatar />
                                            </el-icon>我是普通用户
                                        </el-radio-button>
                                        <el-radio-button  value="transit">
                                            <el-icon>
                                                <i-ep-Van />
                                            </el-icon>我是运输方
                                        </el-radio-button>
                            </el-radio-group>
                    </el-form-item>
                    <el-form-item class="button">
                        <el-button v-loading.fullscreen.lock="fullscreenLoading" @click="submit()" type="primary">
                            <template #icon>
                                <el-icon><i-ep-CircleCheck /></el-icon>
                            </template>
                            点击注册
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>




</template>
<script setup>
import { ref, reactive } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus'
import { ElLoading } from 'element-plus'
const router = useRouter()
const activeIndex = ref('0')
const fullscreenLoading = ref(false)
const ruleForm = reactive({
    userID:'',
    phone:'',
    name:'',
    pw:'',
    role:''
})
const ruleFormRef = ref()
const rules = reactive({
    userID:[
        { required:true, message:'请输入您的用户名,长度在2-20位之间', trigger: "blur" },
        { min:2, max:20, message:"您的用户名长度应为2-20位之间", trigger:"blur"},
        { pattern: /^[\u4e00-\u9fa5a-zA-Z0-9_-]{2,20}$/, message:"非法的用户名，请不要输入除_-以外的字符", trigger:"blur"}  
    ],
    phone:[
        { required: true, message: "请输入手机号", trigger: 'blur' },
        { pattern: /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/, message: "请输入正确的手机号", trigger: 'blur'},
        { len:11, message:"请输入正确的手机号", trigger: 'blur'}
    ],
    name:[
        {min:2, max:20, message:"您的姓名未输入正确", trigger: 'blur'}
    ],
    pw:[
        { required: true, message:"请输入密码", trigger:'blur' },
        { min:6,max:20, message:"密码的长度在6-20位之间", trigger:'blur'}
    ],
    role:[
        { required: true, message: "请选择您的身份", trigger: "blur"}
    ]
});

const toLogin=()=>{
    router.back()
}
const toMainPage=()=>{
    router.push('/')
}
/**
 * @description: 提交表单
 * @return {*} 返回结果
 * @requestType: 无
 */
function submit(){
    //开启加载遮罩
    fullscreenLoading.value = true
    //验证的回调函数
    ruleFormRef.value.validate(async (valid) => {
        if(valid){

          const options = {
            method: 'post',
            headers: {"content-type": "application/json"},
            data: ruleForm,
            url: '/api/adduser',
            // timeout: 5000
          };

          // console.log(options)
            //等待注册接口
            await axios(options).then(async res => {
                let data = res.data
                if (data.code == '1000') {
                    //将加载遮罩关闭
                    fullscreenLoading.value = false
                    //弹出提示
                    ElMessage.success("注册成功！即将前往个人中心")
                    await axios.post('/api/loginNoCaptcha',{"phone":ruleForm.phone,"pw":ruleForm.pw}).then(response=>{
                        if(response.data.code=='2000'){
                            localStorage.setItem('userSession', response.data.data )
                            // 根据角色跳转到相应页面
                            if(ruleForm.role === 'transit'){
                                router.push('/transit')
                            } else {
                                router.push('/user')
                            }
                            
                        }
                    })
                    
                    
                    
                }
            }).catch(err=>{
                fullscreenLoading.value = false
                ElMessage.error('注册失败，服务器开小差了')
            })
        }else{
            fullscreenLoading.value = false
            ElMessage.error("请检查表单是否正确！")
        }
    })
    //!不要使用axios发json的get 草你妈测半天
    
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
  width: 480px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 40px 40px;
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
  margin-bottom: 22px;
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
  margin-bottom: 25px;
}

.contentBody :deep(.el-radio-group) {
  width: 100%;
  display: flex;
  gap: 15px;
}

.contentBody :deep(.el-radio-button) {
  flex: 1;
}

.contentBody :deep(.el-radio-button__inner) {
  width: 100%;
  border-radius: 10px !important;
  border: 2px solid #e4e7ed !important;
  box-shadow: none !important;
  padding: 12px 20px;
  transition: all 0.3s;
}

.contentBody :deep(.el-radio-button__inner:hover) {
  border-color: #667eea !important;
  color: #667eea;
}

.contentBody :deep(.el-radio-button.is-active .el-radio-button__inner) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  border-color: transparent !important;
  color: white;
}

.contentBody :deep(.el-radio-button:first-child .el-radio-button__inner) {
  border-left: 2px solid #e4e7ed !important;
  border-radius: 10px !important;
}

.contentBody :deep(.el-radio-button:last-child .el-radio-button__inner) {
  border-radius: 10px !important;
}
</style>

