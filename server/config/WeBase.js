/*
 * @Author: xpxxy
 * @Date: 2024-01-28 22:56:06
 * @Description: 
 * 实现webase相关的接口，并暴露出去
 * 1.webase登录（获取管理员访问的token）
 * 2.用户链上操作
 */

// Webase登录信息（已修正为你的配置）
const account = "admin";
const accountPwd = "Abcd1234"; // 你的明文密码
const groupId = 1; // 群组ID（数字格式，默认1）

// 合约调用者地址 - 从WeBase私钥管理获取的用户地址（admin用户）
const xpxxy = "0xfa6f67fdd76a25772c4eee46ea681f2e7c85c13f"; // admin用户公钥地址

// ===== 三个合约的配置 =====
// 1. LogisticsForm 合约（主合约）
const contractAddr_LogisticsForm = "0xa6219330bccff19f97ba4910bde0b4a95523c8a2";
const contractID_LogisticsForm = 200004;

// 2. LogisticsInfo 合约
const contractAddr_LogisticsInfo = "0xafbe4060518a896be09dd427613a7bb5e6032307";
const contractID_LogisticsInfo = 200003;

// 3. CommodityInfo 合约
const contractAddr_CommodityInfo = "0xb4de8803705691a48905bc48864c43d6df3d6ee8";
const contractID_CommodityInfo = 200002;

// 默认使用 LogisticsForm 合约（向后兼容）
const contractAddr = contractAddr_LogisticsForm;
const contractID = contractID_LogisticsForm;

// LogisticsForm 合约 ABI（主合约）
const contractAbi_LogisticsForm = [{ "inputs": [{ "internalType": "address", "name": "_logisticsInfoAddress", "type": "address" }, { "internalType": "address", "name": "_commodityInfoAddress", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "formAddress", "type": "address" }, { "indexed": true, "internalType": "address", "name": "logisticsAddress", "type": "address" }], "name": "FormCreated", "type": "event" }, { "inputs": [], "name": "commodityInfo", "outputs": [{ "internalType": "contract CommodityInfo", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_logisticsAddress", "type": "address" }, { "internalType": "address", "name": "_transitAddress", "type": "address" }, { "internalType": "string", "name": "_transitContact", "type": "string" }, { "internalType": "string", "name": "_transitAddrInfo", "type": "string" }], "name": "createLogisticsForm", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_senderAddress", "type": "address" }, { "internalType": "string", "name": "_logisticsCompanyName", "type": "string" }, { "internalType": "string", "name": "_senderAddressInfo", "type": "string" }, { "internalType": "string", "name": "_senderContact", "type": "string" }, { "internalType": "address", "name": "_receiverAddress", "type": "address" }, { "internalType": "address", "name": "_productAddress", "type": "address" }, { "internalType": "string", "name": "_receiverAddressInfo", "type": "string" }, { "internalType": "string", "name": "_receiverContact", "type": "string" }], "name": "createLogisticsInfo", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "formAddresses", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "forms", "outputs": [{ "internalType": "address", "name": "logistics", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getAllForms", "outputs": [{ "internalType": "address[]", "name": "", "type": "address[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getAllLogisticsAddresses", "outputs": [{ "internalType": "address[]", "name": "", "type": "address[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getAllLogisticsInfo", "outputs": [{ "internalType": "string[]", "name": "", "type": "string[]" }, { "internalType": "address[]", "name": "", "type": "address[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getAllProducts", "outputs": [{ "internalType": "string[]", "name": "", "type": "string[]" }, { "internalType": "address[]", "name": "", "type": "address[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_formAddress", "type": "address" }], "name": "getFormInfo", "outputs": [{ "internalType": "string", "name": "", "type": "string" }, { "internalType": "string", "name": "", "type": "string" }, { "internalType": "string", "name": "", "type": "string" }, { "internalType": "string", "name": "", "type": "string" }, { "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_logisticsAddress", "type": "address" }], "name": "getLogisticsInfo", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_productAddress", "type": "address" }], "name": "getProductInfo", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "logisticsInfo", "outputs": [{ "internalType": "contract LogisticsInfo", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "_name", "type": "string" }, { "internalType": "string", "name": "_productionDate", "type": "string" }, { "internalType": "string", "name": "_expiryDate", "type": "string" }, { "internalType": "string", "name": "_type", "type": "string" }, { "internalType": "string", "name": "_barcode", "type": "string" }], "name": "storeProductInfo", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_formAddress", "type": "address" }, { "internalType": "address", "name": "_transitAddress", "type": "address" }, { "internalType": "string", "name": "_transitContact", "type": "string" }, { "internalType": "string", "name": "_transitAddrInfo", "type": "string" }], "name": "updateLogisticsForm", "outputs": [], "stateMutability": "nonpayable", "type": "function" }];

// CommodityInfo 合约 ABI（商品信息合约）
const contractAbi_CommodityInfo = [{ "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "productAddress", "type": "address" }, { "indexed": false, "internalType": "string", "name": "name", "type": "string" }, { "indexed": false, "internalType": "string", "name": "productionDate", "type": "string" }, { "indexed": false, "internalType": "string", "name": "expirationDate", "type": "string" }, { "indexed": false, "internalType": "string", "name": "productType", "type": "string" }, { "indexed": false, "internalType": "string", "name": "barcode", "type": "string" }], "name": "ProductStored", "type": "event" }, { "inputs": [], "name": "getAllProductsInfo", "outputs": [{ "internalType": "string[]", "name": "", "type": "string[]" }, { "internalType": "address[]", "name": "", "type": "address[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_productAddress", "type": "address" }], "name": "getProductInfo", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "productAddresses", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "products", "outputs": [{ "internalType": "string", "name": "name", "type": "string" }, { "internalType": "string", "name": "productionDate", "type": "string" }, { "internalType": "string", "name": "expirationDate", "type": "string" }, { "internalType": "string", "name": "productType", "type": "string" }, { "internalType": "string", "name": "barcode", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "_name", "type": "string" }, { "internalType": "string", "name": "_productionDate", "type": "string" }, { "internalType": "string", "name": "_expirationDate", "type": "string" }, { "internalType": "string", "name": "_productType", "type": "string" }, { "internalType": "string", "name": "_barcode", "type": "string" }], "name": "storeProduct", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "nonpayable", "type": "function" }];

// LogisticsInfo 合约 ABI（物流信息合约）
const contractAbi_LogisticsInfo = [{ "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "logisticsAddress", "type": "address" }, { "indexed": false, "internalType": "string", "name": "senderAddress", "type": "string" }, { "indexed": false, "internalType": "string", "name": "logisticsCompanyName", "type": "string" }, { "indexed": false, "internalType": "string", "name": "senderAddressInfo", "type": "string" }, { "indexed": false, "internalType": "string", "name": "senderContact", "type": "string" }, { "indexed": false, "internalType": "string", "name": "receiverAddress", "type": "string" }, { "indexed": false, "internalType": "string", "name": "productAddress", "type": "string" }, { "indexed": false, "internalType": "string", "name": "receiverAddressInfo", "type": "string" }, { "indexed": false, "internalType": "string", "name": "receiverContact", "type": "string" }], "name": "LogisticsInfoStored", "type": "event" }, { "inputs": [{ "internalType": "address", "name": "_senderAddress", "type": "address" }, { "internalType": "string", "name": "_logisticsCompanyName", "type": "string" }, { "internalType": "string", "name": "_senderAddressInfo", "type": "string" }, { "internalType": "string", "name": "_senderContact", "type": "string" }, { "internalType": "address", "name": "_receiverAddress", "type": "address" }, { "internalType": "address", "name": "_productAddress", "type": "address" }, { "internalType": "string", "name": "_receiverAddressInfo", "type": "string" }, { "internalType": "string", "name": "_receiverContact", "type": "string" }], "name": "storeLogisticsInfo", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_logisticsAddress", "type": "address" }], "name": "getLogisticsInfo", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getAllLogisticsAddresses", "outputs": [{ "internalType": "address[]", "name": "", "type": "address[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getAllLogisticsInfo", "outputs": [{ "internalType": "string[]", "name": "", "type": "string[]" }, { "internalType": "address[]", "name": "", "type": "address[]" }], "stateMutability": "view", "type": "function" }];

// 默认使用 LogisticsForm 合约 ABI（向后兼容）
const contractAbi = contractAbi_LogisticsForm;

const qs = require("qs");
const axios = require("axios");
const utils = require("../utils/utils.js"); // 路径正确（从config到utils）

/**
 * Webase登录（支持无认证模式 isUseSecurity: false）
 * @return {string} 用户操作token
 */
async function webaselogin() {
    try {
        const logindata = { account, accountPwd }; // 明文密码直接传
        const options = {
            method: 'post',
            headers: { 'Content-type': 'application/json' }, // 用JSON格式（解决405）
            data: logindata, // 直接传JSON对象，无需序列化
            url: 'http://localhost:5001/WeBASE-Node-Manager/account/login', // 正确的登录API路径
            timeout: 5000
        };
        console.log("正在连接 WeBase 登录接口...", options.url);
        const res = await axios(options);

        console.log("WeBase 登录响应：", JSON.stringify(res.data, null, 2));

        // 适配无认证模式：直接返回token或使用默认token
        let token = null;

        // 尝试从响应中提取token
        if (res.data && res.data.data && res.data.data.token) {
            token = res.data.data.token;
        } else if (res.data && res.data.token) {
            token = res.data.token;
        } else if (res.data && res.data.code === 0) {
            // 无认证模式：登陆成功但不返回token，使用account作为token
            console.log("检测到无认证模式，使用account作为token");
            token = account;
        } else if (res.status === 200) {
            // 如果HTTP状态是200但没有特定的code字段，也认为登陆成功
            console.log("HTTP 200响应，使用account作为token");
            token = account;
        }

        if (!token) {
            console.error("无法解析token，响应数据：", res.data);
            throw new Error('登录响应中未包含token或无法解析');
        }

        console.log("Webase登录成功，获取到token：", token);
        return token;
    } catch (error) {
        console.error("获取webase用户token失败：", error.message);
        if (error.response) {
            console.error("响应状态：", error.response.status);
            console.error("响应数据：", JSON.stringify(error.response.data, null, 2));
        }
        throw error; // 抛出错误，避免后续使用null
    }
}

/**
 * 获取用户操作token（简化流程）
 * @return {string} 最终可用的AuthorizationToken
 */
async function getUserToken() {
    try {
        return await webaselogin(); // 直接调用登录接口
    } catch (error) {
        console.error("获取用户token失败：" + error.message);
        throw error;
    }
}

/**
 * Webase新增用户
 * @param {string} token - 管理员token
 * @param {object} data - 用户信息（userID, role等）
 * @return {string} 用户链上地址
 */
async function webaseAddNewUser(token, data) {
    try {
        // WeBASE 添加用户的正确接口路径
        const options = {
            method: 'POST',
            headers: {
                "content-type": "application/json",
                'AuthorizationToken': `Token ${token}` // Token后必须加空格
            },
            data: {
                groupId, // 数字格式的群组ID
                description: data.role || '',
                userName: data.userID,
                account // 管理员账号
            },
            // 修复：使用正确的添加用户接口路径
            url: 'http://localhost:5001/WeBASE-Node-Manager/user/userInfo',
            timeout: 10000 // 增加超时时间
        };
        console.log("正在调用 WeBase 添加用户接口...", options.url);
        console.log("请求数据：", JSON.stringify(options.data, null, 2));
        const res = await axios(options);

        console.log("WeBase 添加用户响应：", JSON.stringify(res.data, null, 2));

        // 检查响应格式，适配不同的响应结构
        if (!res.data) {
            throw new Error('WeBASE 返回空响应');
        }

        // 如果返回 code 不为 0，说明失败
        if (res.data.code !== 0 && res.data.code !== undefined) {
            throw new Error(`添加用户失败：${res.data.message || res.data.msg || '未知错误'}`);
        }

        // 尝试从不同可能的路径获取地址
        let address = null;
        if (res.data.data && res.data.data.address) {
            address = res.data.data.address;
        } else if (res.data.data && res.data.data.userAddress) {
            address = res.data.data.userAddress;
        } else if (res.data.address) {
            address = res.data.address;
        } else if (res.data.data) {
            // 如果 data 本身就是地址字符串
            address = typeof res.data.data === 'string' ? res.data.data : null;
        }

        if (!address) {
            throw new Error(`添加用户失败：未返回用户地址。响应：${JSON.stringify(res.data)}`);
        }

        return address;
    } catch (error) {
        console.error("webase添加用户失败：", error.message);
        if (error.response) {
            console.error("响应状态：", error.response.status);
            console.error("响应数据：", JSON.stringify(error.response.data, null, 2));
            // 如果是 405 错误，提供更详细的提示
            if (error.response.status === 405) {
                throw new Error(`WeBASE 接口方法不允许(405)，请检查接口路径和方法是否正确。当前路径：${error.config?.url}`);
            }
        }
        throw error;
    }
}

/**
 * 获取用户列表
 * @param {string} token - 管理员token
 * @return {object} 用户列表数据
 */
async function searchUser(token) {
    try {
        const options = {
            method: 'get',
            url: 'http://localhost:5001/WeBASE-Node-Manager/user/userList/1/1/10',
            headers: { 'AuthorizationToken': `Token ${token}` },
        };
        const res = await axios(options);
        return res.data;
    } catch (error) {
        console.error("获取用户列表失败：" + error.message);
        throw error;
    }
}

/**
 * 查找单个商品信息
 * @param {string} token - 用户token
 * @param {string} data - 商品地址
 * @return {object} 商品信息
 */
async function getOneGoods(token, data) {
    try {
        const options = {
            method: "post",
            url: "http://localhost:5001/WeBASE-Node-Manager/contract/transaction",
            headers: {
                'AuthorizationToken': `Token ${token}`,
                "content-type": "application/json"
            },
            data: {
                groupId,
                user: xpxxy,
                contractName: "LogisticsForm",
                funcName: "getProductInfo",
                funcParam: [data],
                contractAbi,
                contractId: contractID,
                contractAddress: contractAddr,
            }
        };
        const res = await axios(options);
        if (!res.data || res.data.code !== 0 || !res.data.data || !res.data.data.length) {
            throw new Error("获取商品信息失败：响应数据异常");
        }
        return JSON.parse(res.data.data[0]);
    } catch (error) {
        console.error("获取商品信息报错：" + error.message);
        throw error;
    }
}

/**
 * 链上存储商品
 * @param {string} token - 用户token
 * @param {object} data - 商品信息
 * @return {string} 商品链上地址
 */
async function storeProduct(token, data) {
    try {
        const options = {
            method: "post",
            url: "http://localhost:5001/WeBASE-Node-Manager/contract/transaction",
            headers: {
                'AuthorizationToken': `Token ${token}`,
                "content-type": "application/json"
            },
            data: {
                groupId,
                user: xpxxy,
                contractName: "CommodityInfo",
                funcName: "storeProduct",
                funcParam: [data.name, data.productionDate, data.expirationDate, data.productType, data.barcode],
                contractAbi: contractAbi_CommodityInfo,
                contractId: contractID_CommodityInfo,
                contractAddress: contractAddr_CommodityInfo,
            }
        };
        const res = await axios(options);
        if (!res.data || res.data.code !== 0 || !res.data.data || !res.data.data.output) {
            throw new Error("存储商品失败：" + (res.data && res.data.message));
        }
        return utils.addressToString(res.data.data.output);
    } catch (error) {
        console.error("存储商品报错：" + error.message);
        throw error;
    }
}

/**
 * 创建物流表单头信息
 * @param {string} token - 用户token
 * @param {object} data - 物流信息
 * @return {string} 物流信息链上地址
 */
async function createLogisticsInfo(token, data) {
    try {
        // 确保所有参数类型正确
        // ABI参数顺序: _senderAddress(address), _logisticsCompanyName(string), _senderAddressInfo(string), 
        //             _senderContact(string), _receiverAddress(address), _productAddress(address), 
        //             _receiverAddressInfo(string), _receiverContact(string)
        
        // 地址类型需要标准化为42位格式
        const senderAddr = utils.normalizeAddress(data.senderAddr);
        const receiverAddr = utils.normalizeAddress(data.receiverAddr);
        const productAddr = utils.normalizeAddress(data.productAddr);
        
        const funcParam = [
            senderAddr,                        // address - 发件人地址
            String(data.logisticsCompanyName || ''), // string - 快递公司名称
            String(data.senderAddressInfo || ''),    // string - 发件地址信息
            String(data.senderContact || ''),        // string - 发件人联系方式
            receiverAddr,                      // address - 收件人地址
            productAddr,                       // address - 商品地址
            String(data.receiverAddressInfo || ''),  // string - 收件地址信息
            String(data.receiverContact || '')       // string - 收件人联系方式
        ];
        
        console.log("createLogisticsInfo 参数：", funcParam);
        console.log("地址格式检查 - senderAddr:", senderAddr, "长度:", senderAddr.length);
        console.log("地址格式检查 - receiverAddr:", receiverAddr, "长度:", receiverAddr.length);
        console.log("地址格式检查 - productAddr:", productAddr, "长度:", productAddr.length);
        
        const options = {
            method: "post",
            url: "http://localhost:5001/WeBASE-Node-Manager/contract/transaction",
            headers: {
                'AuthorizationToken': `Token ${token}`,
                "content-type": "application/json"
            },
            data: {
                groupId,
                user: xpxxy,
                contractName: "LogisticsForm",
                funcName: "createLogisticsInfo",
                funcParam: funcParam,
                contractAbi,
                contractId: contractID,
                contractAddress: contractAddr,
            }
        };
        const res = await axios(options);
        console.log("createLogisticsInfo 响应：", JSON.stringify(res.data, null, 2));
        
        // 检查响应是否成功
        if (!res.data || res.data.code !== 0) {
            throw new Error("创建物流信息失败：" + JSON.stringify(res.data));
        }
        
        // 检查交易是否成功执行
        if (!res.data.data || !res.data.data.statusOK) {
            throw new Error("智能合约执行失败：" + (res.data.data?.statusMsg || "未知错误") + 
                          "，message: " + (res.data.data?.message || ""));
        }
        
        // 检查输出是否有效
        if (!res.data.data.output || res.data.data.output === "0x") {
            throw new Error("智能合约返回空地址，可能是合约逻辑问题");
        }
        
        return utils.addressToString(res.data.data.output);
    } catch (error) {
        console.error("创建物流信息报错：" + error.message);
        if (error.response) {
            console.error("响应数据：", JSON.stringify(error.response.data, null, 2));
        }
        throw error;
    }
}

/**
 * 创建电子表单
 * @param {string} token - 用户token
 * @param {object} data - 表单数据
 * @return {string} 表单链上地址
 */
async function createLogisticsForm(token, data) {
    try {
        // 确保所有参数类型正确
        // ABI参数顺序: _logisticsAddress(address), _transitAddress(address), 
        //             _transitContact(string), _transitAddrInfo(string)
        
        // 地址类型需要标准化为42位格式
        const logisticsInfoAddr = utils.normalizeAddress(data.logisticsInfoAddr);
        const transitAddr = utils.normalizeAddress(data.transitAddr);
        
        const funcParam = [
            logisticsInfoAddr,               // address - 物流信息地址
            transitAddr,                     // address - 中转地址
            String(data.transitContact || ''),   // string - 中转联系方式
            String(data.transitAddrInfo || '')   // string - 中转地址信息
        ];
        
        console.log("createLogisticsForm 参数：", funcParam);
        console.log("地址格式检查 - logisticsInfoAddr:", logisticsInfoAddr, "长度:", logisticsInfoAddr.length);
        console.log("地址格式检查 - transitAddr:", transitAddr, "长度:", transitAddr.length);
        
        const options = {
            method: "post",
            url: "http://localhost:5001/WeBASE-Node-Manager/contract/transaction",
            headers: {
                'AuthorizationToken': `Token ${token}`,
                "content-type": "application/json"
            },
            data: {
                groupId,
                user: xpxxy,
                contractName: "LogisticsForm",
                funcName: "createLogisticsForm",
                funcParam: funcParam,
                contractAbi,
                contractId: contractID,
                contractAddress: contractAddr,
            }
        };
        const res = await axios(options);
        console.log("createLogisticsForm 响应：", JSON.stringify(res.data, null, 2));
        
        // 检查响应是否成功
        if (!res.data || res.data.code !== 0) {
            throw new Error("创建物流表单失败：" + JSON.stringify(res.data));
        }
        
        // 检查交易是否成功执行
        if (!res.data.data || !res.data.data.statusOK) {
            throw new Error("智能合约执行失败：" + (res.data.data?.statusMsg || "未知错误") + 
                          "，message: " + (res.data.data?.message || ""));
        }
        
        // 检查输出是否有效
        if (!res.data.data.output || res.data.data.output === "0x") {
            throw new Error("智能合约返回空地址，可能是合约逻辑问题");
        }
        
        return utils.addressToString(res.data.data.output);
    } catch (error) {
        console.error("创建物流表单报错：" + error.message);
        if (error.response) {
            console.error("响应数据：", JSON.stringify(error.response.data, null, 2));
        }
        throw error;
    }
}

/**
 * 获取物流表单头信息
 * @param {string} token - 用户token
 * @param {object} data - 表单头地址
 * @return {object} 表单头信息
 */
async function getLogisticsInfo(token, data) {
    try {
        const options = {
            method: 'post',
            url: "http://localhost:5001/WeBASE-Node-Manager/contract/transaction",
            headers: {
                'AuthorizationToken': `Token ${token}`,
                "content-type": "application/json"
            },
            data: {
                groupId,
                user: xpxxy,
                contractName: "LogisticsForm",
                funcName: "getLogisticsInfo",
                funcParam: [data.LogisticsInfoAddr],
                contractAbi,
                contractId: contractID,
                contractAddress: contractAddr,
            }
        };
        const res = await axios(options);
        if (!res.data || res.data.code !== 0 || !res.data.data || !res.data.data.length) {
            throw new Error("获取物流信息失败：响应异常");
        }
        return JSON.parse(res.data.data[0]);
    } catch (error) {
        console.error("获取物流信息报错：" + error.message);
        throw error;
    }
}

/**
 * 获取电子表单完整信息
 * @param {string} token - 用户token
 * @param {object} data - 表单地址
 * @return {object} 表单完整信息
 */
async function getLogisticsForm(token, data) {
    try {
        const options = {
            method: 'post',
            url: "http://localhost:5001/WeBASE-Node-Manager/contract/transaction",
            headers: {
                'AuthorizationToken': `Token ${token}`,
                "content-type": "application/json"
            },
            data: {
                groupId,
                user: xpxxy,
                contractName: "LogisticsForm",
                funcName: "getFormInfo",
                funcParam: [data.formAddr],
                contractAbi,
                contractId: contractID,
                contractAddress: contractAddr,
            }
        };
        const res = await axios(options);
        if (!res.data || res.data.code !== 0 || !res.data.data || !res.data.data.length) {
            throw new Error("获取表单信息失败：响应异常");
        }
        return JSON.parse(res.data.data[0]);
    } catch (error) {
        console.error("获取表单信息报错：" + error.message);
        throw error;
    }
}

/**
 * 获取所有商品信息
 * @param {string} token - 用户token
 * @return {array} 商品信息列表
 */
async function getAllProducts(token) {
    try {
        const options = {
            method: 'post',
            url: "http://localhost:5001/WeBASE-Node-Manager/contract/transaction",
            headers: {
                'AuthorizationToken': `Token ${token}`,
                "content-type": "application/json"
            },
            data: {
                groupId,
                user: xpxxy,
                contractName: "LogisticsForm",
                funcName: "getAllProducts",
                funcParam: [],
                contractAbi,
                contractId: contractID,
                contractAddress: contractAddr,
            }
        };
        const res = await axios(options);
        if (!res.data || res.data.code !== 0 || !res.data.data || !res.data.data.length) {
            throw new Error("获取所有商品失败：响应异常");
        }
        const productInfo = JSON.parse(res.data.data[0]);
        const parsedInfo = productInfo.map(product => JSON.parse(product));
        const productAddr = JSON.parse(res.data.data[1]);
        return [parsedInfo, productAddr];
    } catch (error) {
        console.error("获取所有商品报错：" + error.message);
        throw error;
    }
}

/**
 * 查询单个表单数据
 * @param {string} token - 用户token
 * @param {string} data - 表单地址
 * @return {array} 表单数据
 */
async function getFormInfo(token, data) {
    try {
        const options = {
            method: 'post',
            url: "http://localhost:5001/WeBASE-Node-Manager/contract/transaction",
            headers: {
                'AuthorizationToken': `Token ${token}`,
                "content-type": "application/json"
            },
            data: {
                groupId,
                user: xpxxy,
                contractName: "LogisticsForm",
                funcName: "getFormInfo",
                funcParam: [data],
                contractAbi,
                contractId: contractID,
                contractAddress: contractAddr,
            }
        };
        const res = await axios(options);
        const rawData = res.data.data;
        const result = [];
        if (rawData.length === 5) {
            rawData.forEach(item => result.push(JSON.parse(item)));
            return rawData;
        } else {
            return result;
        }
    } catch (error) {
        console.error("查询表单数据报错：" + error.message);
        throw error;
    }
}

/**
 * 更新电子表单
 * @param {string} token - 用户token
 * @param {object} data - 更新数据
 * @return {string} 操作结果
 */
async function updateForm(token, data) {
    try {
        const options = {
            method: 'post',
            url: "http://localhost:5001/WeBASE-Node-Manager/contract/transaction",
            headers: {
                'AuthorizationToken': `Token ${token}`,
                "content-type": "application/json"
            },
            data: {
                groupId,
                user: xpxxy,
                contractName: "LogisticsForm",
                funcName: "updateLogisticsForm",
                funcParam: [data.formAddr, data.transitAddr, data.transitContact, data.transitAddrInfo],
                contractAbi,
                contractId: contractID,
                contractAddress: contractAddr,
            }
        };
        const res = await axios(options);
        if (!res.data || res.data.code !== 0) {
            throw new Error("更新表单失败：" + (res.data && res.data.message));
        }
        return res.data.data.message;
    } catch (error) {
        console.error("更新表单报错：" + error.message);
        throw error;
    }
}

module.exports = {
    // 认证相关
    getUserToken,

    // 用户相关
    webaseAddNewUser,
    searchUser,

    // 商品相关
    storeProduct,
    getAllProducts,

    // 物流信息相关
    createLogisticsInfo,
    getLogisticsInfo,

    // 物流表单相关
    createLogisticsForm,
    getLogisticsForm,
    getFormInfo,
    updateForm,

    // 合约配置导出（供外部使用）
    // LogisticsForm 合约
    contractAddr_LogisticsForm,
    contractID_LogisticsForm,
    contractAbi_LogisticsForm,

    // LogisticsInfo 合约
    contractAddr_LogisticsInfo,
    contractID_LogisticsInfo,

    // CommodityInfo 合约
    contractAddr_CommodityInfo,
    contractID_CommodityInfo,
    contractAbi_CommodityInfo,

    // 默认合约配置（向后兼容）
    contractAddr,
    contractID,
    contractAbi,

    // 基础配置
    account,
    groupId,
    xpxxy
};

