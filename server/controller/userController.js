/*
 * @Author: xpxxy
 * @Description: 
 *  用户相关操作的controller
 *  实现接口：
 *          1.登录注册
 *          2.   
 */

const { Op } = require("sequelize");
// 挂载db的model
const db = require("../models");
// 实例化用户的表
const User = db.user;
const FormInfo = db.formInfo;
const webase = require("../config/WeBase");
const utils = require("../utils/utils.js");
const svgCaptcha = require('svg-captcha');


/**
 * @description: 响应前端创建用户请求并将数据写入数据库，并发送成功或者失败提示
 * @param {*} req 请求体，json的用户名和密码（userID,pw）
 * @param {*} res
 * @return {*}  
 * @requestType POST
 */
// 用户注册接口（修复响应头重复发送问题）
exports.create = async (req, res) => {
    let address = "";
    try {
        // 1. 调用Webase获取用户链上地址
        const token = await webase.getUserToken();
        const response = await webase.webaseAddNewUser(token, req.body);
        address = response;
    } catch (error) {
        // Webase操作失败：发送响应后立即终止
        return res.status(500).send({
            code: "1001",
            message: "webase错误：" + error.message
        });
    }

    // 2. 参数校验（每个校验都带return，避免多次响应）
    if (!req.body.userID) {
        return res.status(400).send({
            code: "1002",
            message: "用户的名称不得为空！"
        });
    }
    if (!req.body.pw) {
        return res.status(400).send({
            code: "1002",
            message: "用户的密码不得为空！"
        });
    }
    if (!req.body.phone) {
        return res.status(400).send({
            code: "1002",
            message: "用户的手机号不得为空！"
        });
    }

    // 3. 组装用户数据
    const user = {
        userID: req.body.userID,
        name: req.body.name,
        pw: req.body.pw,
        phone: req.body.phone,
        address: address,
        role: req.body.role,
        status: 'on'
    };

    // 4. 插入数据库
    try {
        const data = await User.create(user);
        return res.status(200).send({
            code: '1000',
            message: "ok!",
            data: data
        });
    } catch (err) {
        return res.status(500).send({
            code: "500",
            message: err.message || "创建用户出错，请查看console"
        });
    }
};


/**
 * @description: 用户登录接口，查询数据库用户，成功返回登录token凭证(AES加密后，密钥xpxxy)
 * @param {*} req 接受json {phone:手机号,pw:密码}
 * @param {*} res 200 400
 * @return {*} UUID
 * @requestType: GET
 */
exports.login = async (req, res) => {
    const user = {
        phone: req.body.phone,
        pw: req.body.pw,
        captcha: req.body.captcha.toLowerCase()
    };

    // 验证码校验
    if (user.captcha !== req.session.captcha.toLowerCase()) {
        return res.status(200).send({
            code: "2005",
            message: "验证码错误！"
        });
    }

    // 参数校验
    if (!user.phone) {
        return res.status(400).send({
            code: "2001",
            message: "用户的手机号不得为空！"
        });
    }
    if (!req.body.pw) {
        return res.status(400).send({
            code: "2001",
            message: "用户的密码不得为空！"
        });
    }

    // 数据库查询
    try {
        const data = await User.findAll({
            where: { phone: user.phone }
        });

        // 用户不存在
        if (data.length === 0) {
            return res.status(200).send({
                code: '2003',
                message: "用户不存在",
            });
        }

        // 用户已停用
        if (data[0].status === 'off') {
            return res.status(200).send({
                code: '2004',
                message: "登录失败,已停用的用户，请联系管理员",
            });
        }

        // 密码校验
        if (data[0].pw === user.pw) {
            const info = JSON.stringify(data[0]);
            return res.status(200).send({
                code: "2000",
                message: "登录成功！",
                data: utils.aesEncrypt(info, 'xpxxy')
            });
        } else {
            return res.status(200).send({
                code: "2002",
                message: "密码错误"
            });
        }
    } catch (err) {
        return res.status(500).send({
            code: "500",
            message: "数据库出错",
            data: err
        });
    }
};


/**
 * @description: 无验证码登录接口
 * @param {*} req
 * @param {*} res
 * @return {*}
 */
exports.loginButnocaptcha = async (req, res) => {
    const user = {
        phone: req.body.phone,
        pw: req.body.pw,
    };

    // 参数校验
    if (!user.phone) {
        return res.status(400).send({
            code: "2001",
            message: "用户的手机号不得为空！"
        });
    }
    if (!req.body.pw) {
        return res.status(400).send({
            code: "2001",
            message: "用户的密码不得为空！"
        });
    }

    // 数据库查询
    try {
        const data = await User.findAll({
            where: { phone: user.phone }
        });

        // 用户不存在
        if (data.length === 0) {
            return res.status(200).send({
                code: '2003',
                message: "用户不存在",
            });
        }

        // 用户已停用
        if (data[0].status === 'off') {
            return res.status(200).send({
                code: '2004',
                message: "登录失败,已停用的用户，请联系管理员",
            });
        }

        // 密码校验
        if (data[0].pw === user.pw) {
            const info = JSON.stringify(data[0]);
            return res.status(200).send({
                code: "2000",
                message: "登录成功！",
                data: utils.aesEncrypt(info, 'xpxxy')
            });
        } else {
            return res.status(200).send({
                code: "2002",
                message: "密码错误"
            });
        }
    } catch (err) {
        return res.status(500).send({
            code: "500",
            message: "数据库出错",
            data: err
        });
    }
};


/**
 * @description: 管理员登录接口
 * @param {*} req
 * @param {*} res
 * @return {*}
 */
exports.adminLogin = async (req, res) => {
    const user = {
        phone: req.body.phone,
        pw: req.body.pw,
    };

    // 参数校验
    if (!user.phone) {
        return res.status(400).send({
            code: "2001",
            message: "用户的手机号不得为空！"
        });
    }
    if (!req.body.pw) {
        return res.status(400).send({
            code: "2001",
            message: "用户的密码不得为空！"
        });
    }

    // 数据库查询（仅管理员角色）
    try {
        const data = await User.findAll({
            where: { phone: user.phone, role: 'admin' }
        });

        // 密码校验
        if (data.length > 0 && data[0].pw === user.pw) {
            const info = JSON.stringify(data[0]);
            return res.status(200).send({
                code: "2000",
                message: "登录成功！",
                data: utils.aesEncrypt(info, 'xpxxy')
            });
        } else {
            return res.status(200).send({
                code: "2002",
                message: "密码错误或非管理员账号"
            });
        }
    } catch (err) {
        return res.status(500).send({
            code: "500",
            message: "数据库出错",
            data: err
        });
    }
};


/**
 * @description: 退出登录清除session
 * @param {*} req 请求体
 * @param {*} res 响应体
 * @return {*}
 * @requestType: post
 */
exports.logout = async (req, res) => {
    req.session.destroy();
    return res.status(200).send({
        code: "2006",
        message: "退出成功！"
    });
};


/**
 * @description: 修改用户的账户状态
 * @param {*} req 请求体 接受json {status:"用户的当前状态"，phone:"用户手机号"}
 * @param {*} res 响应体 200成功 400入参错误
 * @return {*}返回结果
 * @requestType: post
 */
exports.changeStatus = async (req, res) => {
    const user = {
        status: req.body.status,
        phone: req.body.phone,
        id: req.body.id,
    };

    if (user.status === 'on') {
        try {
            const response = await FormInfo.findOne({
                attributes: ['receiverContact', 'senderContact', 'status'],
                where: {
                    [Op.or]: [{ receiverContact: user.phone }, { senderContact: user.phone }],
                    status: 'on'
                }
            });
            if (!response) {
                return res.status(200).send({
                    code: "2008",
                    message: "状态不可更改"
                });
            } else {
                await User.update({ status: 'off' }, { where: { id: user.id } });
                return res.status(200).send({
                    code: "2007",
                    message: "修改成功！"
                });
            }
        } catch (err) {
            return res.status(500).send({
                code: "500",
                message: err.message
            });
        }
    } else {
        try {
            await User.update({ status: 'on' }, { where: { id: user.id } });
            return res.status(200).send({
                code: "2007",
                message: "修改成功！"
            });
        } catch (err) {
            return res.status(500).send({
                code: "500",
                message: err.message
            });
        }
    }
};


/**
 * @description: 验证码服务接口
 * @param {*} req 无
 * @param {*} res 
 * @return {*}返回验证码的svg和值
 * @requestType: get
 */
exports.getCaptcha = async (req, res) => {
    const captcha = svgCaptcha.create({
        size: 4,
        noise: 4,
        fontSize: 50,
        width: 100,
        height: 35,
        color: false
    });
    req.session.captcha = captcha.text;
    return res.status(200).send({
        data: captcha.data
    });
};


/**
 * @description: 获取所有用户信息
 * @param {*} req
 * @param {*} res
 * @return {*}
 */
exports.getAllUser = async (req, res) => {
    try {
        const response = await User.findAll({
            attributes: ['id', 'userID', 'name', 'address', 'phone', 'role', 'status', 'createdAt']
        });
        if (response.length !== 0) {
            return res.status(200).send({
                code: "2000",
                message: "ok",
                data: response
            });
        } else {
            return res.status(200).send({
                code: "2003",
                message: "没有数据",
            });
        }
    } catch (err) {
        return res.status(500).send({ code: "500", message: err.message });
    }
};


/**
 * @description: 修改用户信息（包括用户名、密码、真实姓名、手机号）
 * @param {*} req
 * @param {*} res
 * @return {*}
 */
exports.changeInfo = async (req, res) => {
    const { userID, pw, name, phone } = req.body;
    
    // 参数校验
    if (!pw) {
        return res.status(200).send({
            code: "2001",
            message: "密码不能为空"
        });
    }
    
    try {
        // 根据原手机号查找用户
        const user = await User.findOne({ where: { phone: phone } });
        
        if (!user) {
            return res.status(200).send({
                code: "2002",
                message: "用户不存在"
            });
        }
        
        // 更新用户信息
        await User.update(
            { 
                userID: userID,
                pw: pw, 
                name: name,
            }, 
            { where: { phone: phone } }
        );
        
        return res.status(200).send({
            code: "2000",
            message: "修改成功"
        });
    } catch (err) {
        return res.status(500).send({
            code: "500",
            message: err.message
        });
    }
};

/**
 * @description: 修改密码
 * @param {*} req
 * @param {*} res
 * @return {*}
 */
exports.changePassword = async (req, res) => {
    const { userID, oldPassword, newPassword } = req.body;
    
    try {
        // 查找用户并验证原密码
        const user = await User.findOne({ where: { userID } });
        
        if (!user) {
            return res.status(200).send({
                code: "2001",
                message: "用户不存在"
            });
        }
        
        if (user.pw !== oldPassword) {
            return res.status(200).send({
                code: "2002",
                message: "原密码错误"
            });
        }
        
        // 更新密码
        await User.update({ pw: newPassword }, { where: { userID } });
        
        return res.status(200).send({
            code: "2000",
            message: "密码修改成功"
        });
    } catch (err) {
        return res.status(500).send({
            code: "500",
            message: err.message
        });
    }
};

/**
 * @description: 更换手机号
 * @param {*} req
 * @param {*} res
 * @return {*}
 */
exports.changePhone = async (req, res) => {
    const { userID, newPhone, password } = req.body;
    
    try {
        // 查找用户并验证密码
        const user = await User.findOne({ where: { userID } });
        
        if (!user) {
            return res.status(200).send({
                code: "2001",
                message: "用户不存在"
            });
        }
        
        if (user.pw !== password) {
            return res.status(200).send({
                code: "2002",
                message: "密码错误"
            });
        }
        
        // 检查新手机号是否已被使用
        const existingUser = await User.findOne({ where: { phone: newPhone } });
        if (existingUser && existingUser.userID !== userID) {
            return res.status(200).send({
                code: "2003",
                message: "该手机号已被其他用户使用"
            });
        }
        
        // 更新手机号
        await User.update({ phone: newPhone }, { where: { userID } });
        
        return res.status(200).send({
            code: "2000",
            message: "手机号更换成功"
        });
    } catch (err) {
        return res.status(500).send({
            code: "500",
            message: err.message
        });
    }
};

