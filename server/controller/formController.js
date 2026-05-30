/*
 * @Author: xpxxy
 * @Description: 表单头的controller
 */
const db = require('../models');
const webase = require('../config/WeBase');
const axios = require('axios');
const { formDataArrayProcess, hidePhoneNumber, formDataObjProcess } = require('../utils/utils');

const FormInfo = db.formInfo;
const Form = db.form;
const Goods = db.goods;

/**
 * @description: 查找表单头信息接口，先查询库，再查链
 * @param {*} req 请求体
 * @param {*} res 响应体
 * @return {*} 
 * @requestType POST
 */
exports.findOneLogisticsInfo = async(req, res) => {
    const logisticsInfoAddr = req.body.logisticsInfoAddr;
    if (!logisticsInfoAddr) {
        return res.status(400).send({
            code: "400",
            message: "表单头地址不得为空！"
        });
    }

    try {
        const data = await FormInfo.findOne({
            where: { logisticsInfoAddr: logisticsInfoAddr }
        });
        if (data) { // Sequelize findOne 返回 null 而非空数组
            return res.status(200).send({
                code: "200",
                message: "ok!",
                data: data
            });
        } else {
            return res.status(200).send({ // 统一 200 HTTP 码，用业务码区分
                code: "201",
                message: "没找到！"
            });
        }
    } catch (err) {
        return res.status(500).send({
            code: "500",
            message: err.message || "查找信息时出错，请查看console"
        });
    }
};

/**
 * @description: 创建表单
 * @param {*} req 请求体 一个object
 * @param {*} res 响应体
 * @return {*} 返回表单头的地址
 * @requestType POST
 */
exports.createForm = async(req, res) => {
    console.log("创建表单，收到的请求体：", req.body);
    
    // 提取和清理地址（移除多余的空格、制表符等）
    let senderAddr = (req.body.senderAddr || '').toString().trim();
    let receiverAddr = (req.body.receiverAddr || '').toString().trim();
    let productAddr = (req.body.productAddr || '').toString().trim();
    
    // 如果productAddr包含空格或制表符，提取其中的以太坊地址
    if (productAddr.includes(' ') || productAddr.includes('\t')) {
        const addressMatch = productAddr.match(/0x[a-fA-F0-9]{40}/);
        if (addressMatch) {
            productAddr = addressMatch[0];
            console.log("从productAddr中提取的地址：", productAddr);
        }
    }
    
    // 确保联系方式是字符串类型（智能合约ABI要求）
    const senderContact = String(req.body.senderContact || '');
    const receiverContact = String(req.body.receiverContact || '');
    
    const logisticsInfo = {
        senderAddr: senderAddr,
        logisticsCompanyName: req.body.logisticsCompanyName || '',
        senderAddressInfo: req.body.senderAddrInfo || '',
        senderContact: senderContact,
        receiverAddr: receiverAddr,
        receiverAddressInfo: req.body.receiverAddrInfo || '',
        receiverContact: receiverContact,
        productAddr: productAddr,
        logisticsInfoAddr: "",
    };

    const formData = {
        logisticsInfoAddr: "",
        formAddr: "",
        transitAddr: senderAddr,
        transitContact: senderContact,
        transitAddrInfo: req.body.senderAddrInfo || '',
        formInfoId: ''
    };
    
    console.log("准备发送给WeBase的logisticsInfo：", logisticsInfo);
    console.log("准备发送给WeBase的formData：", formData);

    try {
        // 1. 链上创建表单
        const token = await webase.getUserToken();
        const infoAddress = await webase.createLogisticsInfo(token, logisticsInfo);
        if (!infoAddress) {
            return res.status(400).send({
                code: "400",
                message: "链上创建表单头失败，请检查webase连接"
            });
        }
        logisticsInfo.logisticsInfoAddr = infoAddress;
        formData.logisticsInfoAddr = infoAddress;

        const formAddress = await webase.createLogisticsForm(token, formData);
        if (!formAddress) {
            return res.status(400).send({
                code: "400",
                message: "链上创建表单失败，请检查webase连接"
            });
        }
        formData.formAddr = formAddress;

        // 2. 根据productAddr查询对应的goodsId
        const goods = await Goods.findOne({
            attributes: ['id'],
            where: { productAddr: productAddr }
        });
        if (goods) {
            logisticsInfo.goodsId = goods.id;
        }

        // 3. 数据库插入表单头
        await FormInfo.create(logisticsInfo);

        // 4. 获取表单头ID，插入表单表
        const formInfo = await FormInfo.findOne({
            attributes: ['id'],
            where: { logisticsInfoAddr: logisticsInfo.logisticsInfoAddr }
        });

        if (!formInfo) {
            return res.status(500).send({
                code: "500",
                message: "竞争冒险，id虽然被插入但来不及被捕获"
            });
        }

        formData.formInfoId = formInfo.id;
        await Form.create(formData);

        return res.status(200).send({
            code: '4000',
            message: '创建成功！',
            data: { logisticsInfoAddr: infoAddress, formAddr: formAddress }
        });
    } catch (error) {
        console.error("创建表单失败：", error);
        console.error("错误堆栈：", error.stack);
        return res.status(500).send({
            code: "500",
            message: error.message || "连接数据库/链上操作时出错",
            detail: error.response?.data || null
        });
    }
};

/**
 * @description: 查找所有的表单头信息
 * @param {*} req 请求头
 * @param {*} res 响应体
 * @return {*} 返回一个所有表单头的信息数组
 * @requestType POST
 */
exports.findAllLogisticsInfo = async(req, res) => {
    try {
        const data = await FormInfo.findAll({
            include: [{
                model: Goods,
                as: 'good'
            }]
        });
        if (data.length > 0) {
            return res.status(200).send({
                code: "200",
                message: "ok",
                data: data
            });
        } else {
            return res.status(200).send({
                code: "201",
                message: "ok, but table no data"
            });
        }
    } catch (err) {
        return res.status(500).send({
            code: "500",
            message: err.message || "连接数据库出错，请检查console"
        });
    }
};

/**
 * @description: 查询所有表单头的信息地址
 * @param {*} req 请求头
 * @param {*} res 响应体
 * @return {*} 返回所有表单头的信息地址数组
 * @requestType POST
 */
exports.findAllLogisticAddr = async(req, res) => {
    try {
        // 修正：attributes 是数组，且字段名复数
        const data = await FormInfo.findAll({
            attributes: ["logisticsInfoAddr"],
            raw: true // 只返回数据，不返回Sequelize实例
        });
        if (data.length > 0) {
            return res.status(200).send({
                code: "200",
                message: "ok!",
                data: data
            });
        } else {
            return res.status(200).send({
                code: "201",
                message: "ok, but table no data"
            });
        }
    } catch (err) {
        return res.status(500).send({
            code: "500",
            message: err.message || "数据库出现问题，请检查console"
        });
    }
};

/**
 * @description: 获取表单信息（链上查询）
 * @param {*} req 请求体
 * @param {*} res 返回体
 * @return {*} 返回一个数组，第一部分是表单头信息，剩下的三组数据是中转方的溯源数据。
 * @requestType: get
 */
exports.getFormData = async(req, res) => {
    const searchAddr = req.body.formAddr || req.query.formAddr; // 兼容GET/POST
    if (!searchAddr) {
        return res.status(400).send({
            code: "400",
            message: "表单地址不得为空！"
        });
    }

    try {
        const token = await webase.getUserToken();
        const resData = await webase.getFormInfo(token, searchAddr);

        if (!resData || resData.length === 0) {
            return res.status(200).send({
                code: "4004",
                message: "合约参数有误或查询的数据不存在",
                data: []
            });
        }

        return res.status(200).send({
            code: "4000",
            message: "ok!",
            data: resData
        });
    } catch (err) {
        console.error("webase出错：", err.message);
        return res.status(500).send({
            code: "4005",
            message: "webase连接/查询出错",
            error: err.message
        });
    }
};

/**
 * @description: 获取用户的表单信息
 * @param {*} req 请求体
 * @param {*} res 响应体
 * @return {*} 返回一个数组 格式：[{..., [],...},{..., [], ...}...]
 * @requestType: POST
 */
exports.getUserForm = async(req, res) => {
    const userAddr = req.body.userAddr;
    if (!userAddr) {
        return res.status(400).send({
            code: "400",
            message: "用户地址不得为空！"
        });
    }

    try {
        const formInfoData = await FormInfo.findAll({
            where: { receiverAddr: userAddr },
            include: [
                {
                    model: Form,
                    attributes: ['id', 'transitAddr', 'transitContact', 'transitAddrInfo', 'formAddr', 'createdAt'],
                },
                {
                    model: Goods,
                    as: 'good',
                }
            ],
            order: [
                [{ model: Form }, 'id', 'ASC']
            ],
        });

        if (formInfoData.length === 0) {
            return res.status(200).send({
                code: "4001",
                message: "暂无该用户的表单数据"
            });
        }

        return res.status(200).send({
            code: "4000",
            message: "ok!",
            data: formDataArrayProcess(formInfoData)
        });
    } catch (err) {
        return res.status(500).send({
            code: "500",
            message: err.message || "数据库报错！"
        });
    }
};

/**
 * @description: 获取所有表单信息
 * @requestType: POST
 */
exports.getAllForm = async(req, res) => {
    try {
        console.log("开始查询所有表单...");
        const formInfoData = await FormInfo.findAll({
            include: [
                {
                    model: Form,
                    attributes: ['id', 'transitAddr', 'transitContact', 'transitAddrInfo', 'formAddr', 'createdAt'],
                },
                {
                    model: Goods,
                    as: 'good',
                }
            ],
            order: [
                [{ model: Form }, 'id', 'ASC']
            ],
        });

        console.log("查询成功，数据条数：", formInfoData.length);

        if (formInfoData.length === 0) {
            return res.status(200).send({
                code: "4001",
                message: "暂无表单数据"
            });
        }

        const processedData = formDataArrayProcess(formInfoData);
        console.log("数据处理成功");

        return res.status(200).send({
            code: "4000",
            message: "ok!",
            data: processedData
        });
    } catch (err) {
        console.error("getAllForm 错误：", err.message);
        console.error("错误堆栈：", err.stack);
        return res.status(500).send({
            code: "500",
            message: err.message || "数据库报错！"
        });
    }
};

/**
 * @description: 获取经办人相关表单
 * @requestType: POST
 */
exports.getAttendForm = async(req, res) => {
    const Addr = req.body.address;
    if (!Addr) {
        return res.status(400).send({
            code: "400",
            message: "经办人地址不得为空！"
        });
    }

    try {
        // 1. 查询中转记录
        const formList = await Form.findAll({
            attributes: ['logisticsInfoAddr'],
            distinct: true, // 去重
            where: { transitAddr: Addr },
            raw: true
        });

        if (formList.length === 0) {
            return res.status(200).send({
                code: "4001",
                message: "没有中转数据"
            });
        }

        // 2. 批量查询表单头信息（包含商品信息）
        const promises = formList.map(form =>
            FormInfo.findOne({
                where: { logisticsInfoAddr: form.logisticsInfoAddr },
                include: [
                    {
                        model: Form,
                        attributes: ['id', 'transitAddr', 'transitContact', 'transitAddrInfo', 'formAddr', 'createdAt'],
                    },
                    {
                        model: Goods,
                        as: 'good',
                    }
                ],
                order: [
                    [{ model: Form }, 'id', 'ASC']
                ],
            }).then(formInfoData => formDataObjProcess(formInfoData))
        );

        const FinalResult = await Promise.all(promises);
        return res.status(200).send({
            code: '4000',
            data: FinalResult
        });
    } catch (err) {
        return res.status(500).send({
            code: "500",
            message: err.message || "服务器内部错误"
        });
    }
};

/**
 * @description: 通过表单地址搜索表单信息（手机号脱敏）
 * @requestType: POST
 */
exports.searchFormData = async(req, res) => {
    const { searchData, userAddr } = req.body;
    if (!searchData || !userAddr) {
        return res.status(400).send({
            code: "400",
            message: "搜索内容和用户地址不得为空！"
        });
    }

    try {
        const formInfoData = await FormInfo.findAll({
            where: { logisticsInfoAddr: searchData },
            include: [
                {
                    model: Form,
                    attributes: ['id', 'transitAddr', 'transitContact', 'transitAddrInfo', 'formAddr', 'createdAt'],
                },
                {
                    model: Goods,
                    as: 'good',
                }
            ],
            order: [
                [{ model: Form }, 'id', 'ASC']
            ],
        });

        if (formInfoData.length === 0) {
            return res.status(200).send({
                code: "4001",
                message: "没有找到相关表单"
            });
        }

        // 脱敏处理
        const processedData = formInfoData[0].receiverAddr !== userAddr ?
            hidePhoneNumber(formDataArrayProcess(formInfoData)) :
            formDataArrayProcess(formInfoData);

        return res.status(200).send({
            code: "4000",
            message: "ok!",
            data: processedData
        });
    } catch (err) {
        return res.status(500).send({
            code: "500",
            message: err.message || "数据库报错！"
        });
    }
};

/**
 * @description: 获取中转方表单
 * @requestType: POST
 */
exports.getTransitForm = async(req, res) => {
    const userAddr = req.body.userAddr;
    if (!userAddr) {
        return res.status(400).send({
            code: "400",
            message: "用户地址不得为空！"
        });
    }

    try {
        const formInfoData = await FormInfo.findAll({
            where: { senderAddr: userAddr },
            include: [
                {
                    model: Form,
                    attributes: ['id', 'transitAddr', 'transitContact', 'transitAddrInfo', 'formAddr', 'createdAt'],
                },
                {
                    model: Goods,
                    as: 'good',
                }
            ],
            order: [
                [{ model: Form }, 'id', 'ASC']
            ],
        });

        if (formInfoData.length === 0) {
            return res.status(200).send({
                code: "4001",
                message: "暂无该用户的中转表单数据"
            });
        }

        return res.status(200).send({
            code: "4000",
            message: "ok!",
            data: formDataArrayProcess(formInfoData)
        });
    } catch (err) {
        return res.status(500).send({
            code: "500",
            message: err.message || "数据库报错！"
        });
    }
};

/**
 * @description: 更新表单（链上+数据库）
 * @requestType: POST
 */
exports.updateForm = async(req, res) => {
    const transitData = {
        logisticsInfoAddr: req.body.logisticsInfoAddr,
        transitAddr: req.body.transitAddr,
        transitContact: req.body.transitContact,
        transitAddrInfo: req.body.transitAddrInfo,
        formAddr: req.body.formAddr
    };

    // 校验必填参数
    if (!transitData.logisticsInfoAddr || !transitData.formAddr) {
        return res.status(400).send({
            code: "400",
            message: "表单头地址和表单地址不得为空！"
        });
    }

    try {
        // 1. 链上更新
        const token = await webase.getUserToken();
        const chainRes = await webase.updateForm(token, transitData);
        if (chainRes !== 'Success') {
            return res.status(500).send({
                code: "4004",
                message: "链上更新表单失败"
            });
        }

        // 2. 数据库插入新中转记录
        const formInfo = await FormInfo.findOne({
            attributes: ['id'],
            where: { logisticsInfoAddr: transitData.logisticsInfoAddr }
        });

        if (!formInfo) {
            return res.status(500).send({
                code: "500",
                message: "未找到对应的表单头信息"
            });
        }

        transitData.formInfoId = formInfo.id;
        const createResult = await Form.create(transitData);

        return res.status(200).send({
            code: "4007",
            message: "更新成功！",
            data: createResult
        });
    } catch (error) {
        console.error("更新表单失败：", error);
        return res.status(500).send({
            code: "500",
            message: "数据库/链上操作错误",
            error: error.message
        });
    }
};

/**
 * @description: 修改表单状态（修正拼写：chenge → change）
 * @requestType: POST
 */
exports.changeFormStatus = async(req, res) => { // 核心修正：函数名改为 changeFormStatus
    const transitData = {
        logisticsInfoAddr: req.body.logisticsInfoAddr,
        transitAddr: req.body.transitAddr,
        transitContact: req.body.transitContact,
        transitAddrInfo: req.body.transitAddrInfo,
        formAddr: req.body.formAddr
    };

    // 校验必填参数
    if (!transitData.logisticsInfoAddr || !transitData.formAddr) {
        return res.status(400).send({
            code: "400",
            message: "表单头地址和表单地址不得为空！"
        });
    }

    try {
        // 1. 链上更新
        const token = await webase.getUserToken();
        const chainRes = await webase.updateForm(token, transitData);
        if (chainRes !== 'Success') {
            return res.status(500).send({
                code: "4004",
                message: "webase错误，链上更新失败"
            });
        }

        // 2. 数据库更新状态 + 插入中转记录
        const formInfo = await FormInfo.findOne({
            attributes: ['id'],
            where: { logisticsInfoAddr: transitData.logisticsInfoAddr }
        });

        if (!formInfo) {
            return res.status(500).send({
                code: "500",
                message: "未找到对应的表单头信息"
            });
        }

        transitData.formInfoId = formInfo.id;
        await Form.create(transitData);

        // 3. 更新状态为 off
        await Promise.all([
            Form.update({ status: 'off' }, { where: { logisticsInfoAddr: transitData.logisticsInfoAddr } }),
            FormInfo.update({ status: "off" }, { where: { logisticsInfoAddr: transitData.logisticsInfoAddr } })
        ]);

        return res.status(200).send({
            code: "4009",
            message: "修改成功！"
        });
    } catch (error) {
        console.error("修改表单状态失败：", error);
        return res.status(500).send({
            code: "500",
            message: "尝试更新物流中转方出错！",
            error: error.message
        });
    }
};

// 兼容旧拼写（可选，防止遗漏）
exports.chengeFormStatus = exports.changeFormStatus;

/**
 * @description: 启动表单（将停用的表单恢复为运输中状态）
 * @requestType: POST
 */
exports.startForm = async(req, res) => {
    const { logisticsInfoAddr } = req.body;

    if (!logisticsInfoAddr) {
        return res.status(400).send({
            code: "400",
            message: "表单地址不能为空"
        });
    }

    try {
        // 更新数据库状态为 on
        await Promise.all([
            Form.update({ status: 'on' }, { where: { logisticsInfoAddr: logisticsInfoAddr } }),
            FormInfo.update({ status: "on" }, { where: { logisticsInfoAddr: logisticsInfoAddr } })
        ]);

        return res.status(200).send({
            code: "4010",
            message: "表单已启动！"
        });
    } catch (error) {
        console.error("启动表单失败：", error);
        return res.status(500).send({
            code: "500",
            message: "启动表单失败",
            error: error.message
        });
    }
};


