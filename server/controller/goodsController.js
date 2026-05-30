/*
 * @Author: xpxxy
 * @Date: 2024-02-04 22:21:52
 * @Description: 实现商品相关的接口
 * 
 * 
 */
const { Op } = require("sequelize");
const db = require("../models");
const webase = require("../config/WeBase");
const { aesDecrypt, changeTimeFormat } = require("../utils/utils");
const QueryString = require("qs");

const Goods = db.goods;
const FormInfo = db.formInfo;




//查找商品信息
/**
 * @description: 查找单个商品信息接口，先查询数据库有无，再去查链上
 * @param {*} req 请求体 接收JSON,name:查询的商品名称，在库商品支持模糊查询，非在库商品请提供全称
 * @param {*} res 响应体
 * @return {*}返回商品的数据
 * @requestType POST
 */
exports.findOneGoods = async(req, res) => {
    const goodsName = JSON.parse(aesDecrypt(req.body.data, "xpxxy")).name;
    // console.log(goodsName);
    let productInfo = []
    let productAddr = []
    let product = {}
    if (!goodsName) {
        res.status(400).send({
            code: "3003",
            message: "商品名称不得为空！",
        })
        return;
    }
    //^ 没有做重名检查（懒）默认查找第一个出现的，假如有两个香飘飘，返回第一个
    await Goods.findOne({
        where: {
            productName: {
                [Op.like]: `%${ goodsName }%`
            }
        }
    }).then(async data => {
        // console.log(data)
        //*检查数据是否找到
        if (data === null) {
            //*数据库没找到去链上找（费时间）
            try {
                let token = await webase.getUserToken();
                let response = await webase.getAllProducts(token);
                // console.log(response)
                productInfo = response[0]
                productAddr = response[1]
            } catch (error) {
                res.status(200).send({
                        code: "3001",
                        message: "您所求商品即不在库内也不在链上，请检查您的输入"
                    })
                    // console.error(error)
            }
            //*对拿到的商品列表进行检索，然后查找是否有符合的项目
            for (var i = 0; i < productInfo.length; i++) {

                //*如果找到了，则将它存入数据库
                if (productInfo[i].name == goodsName) {
                    product = productInfo[i]
                    product.productAddr = productAddr[i]
                    await Goods.create(product).then(data => {
                        if (data != null) {
                            res.status(200).send({
                                code: "3000",
                                message: "查找成功！",
                                data: data
                            })
                            return
                        }
                    }).catch(err => {
                        res.status(500).send({
                            code: "500",
                            message: "数据库出错" || err.message
                        })
                        return
                    })

                }
            }

            //^如通过了上面的语句都没找到那确定该数据不存在
            res.status(200).send({
                code: "3001",
                message: "没有找到有关您所查询的数据"
            })
            return

        }
        //*数据库内直接就有这个数据
        else {
            //!检查是否停用
            if (data.status === 'off') {
                res.status(200).send({
                    code: "3001",
                    message: "没有找到有关您所查询的数据,请检查您的输入是否正确"
                })
                return
            } else {
                // 格式化数据，添加 name 字段映射和时间格式化
                const formattedData = data.toJSON();
                formattedData.name = formattedData.productName;
                formattedData.createdAt = (new Date(formattedData.createdAt)).toLocaleString();
                formattedData.updatedAt = (new Date(formattedData.updatedAt)).toLocaleString();
                res.status(200).send({
                    code: '3000',
                    message: "ok！",
                    data: formattedData
                })
                return
            }

        }


    }).catch(err => {
        //*数据库出错     
        res.status(500).send({
            code: '500',
            message: err.message || "查找商品时出错，请查看console"
        })
    })





}

/**
 * @description: 查询所有商品信息数据（数据库），一般不会去直接查webase慢且性能消耗大
 * @param {*} req 请求体
 * @param {*} res 返回体
 * @return {*}
 * @requestType GET
 */
exports.findAllGoods = async(req, res) => {
    try {
        const data = await Goods.findAll();
        console.log("从数据库查询到的原始数据：", data.length, "条");
        if (data && data.length > 0) {
            // 将 productName 映射为 name，以兼容前端表格
            const formattedData = data.map(item => {
                const obj = item.toJSON();
                obj.name = obj.productName;
                return obj;
            });
            console.log("映射后的数据（第一条）：", formattedData[0]);
            const finalData = changeTimeFormat(formattedData);
            console.log("时间格式化后的数据（第一条）：", finalData[0]);
            res.status(200).send({
                code: "3000",
                message: "ok!",
                data: finalData,
            });
        } else {
            res.status(200).send({
                code: "3001",
                message: "table doesnt have any data!",
            });
        }
    } catch (err) {
        res.status(500).send({
            code: "500",
            message: err.message || "连接数据库时出错，请查看console",
        });
    }
};
exports.getAllOnGoods = async(req, res) => {
        Goods.findAll().then(data => {
            if (data != null) {
                res.status(200).send({
                    code: "3000",
                    message: "ok!",
                    data: data,
                })
                return
            } else {
                res.status(200).send({
                    code: "3001",
                    message: "table doesnt have any data!",

                })
                return
            }
        }).catch(err => {
            res.status(500).send({
                message: err.message || "连接数据库时出错，请查看console",
            })
        })
    }
    /**
     * @description: 添加商品信息，返回链上地址
     * @param {*} req 请求体，包含商品信息
     * @param {*} res 响应体
     * @return {*}
     * @requestType: 
     */
exports.addNewGoods = async(req, res) => {
    // 参数验证
    if (!req.body.name && !req.body.productName) {
        return res.status(400).send({
            code: "400",
            message: "商品名称不能为空"
        });
    }
    if (!req.body.productType) {
        return res.status(400).send({
            code: "400",
            message: "商品类型不能为空"
        });
    }

    // 用于 WeBase 链上操作的数据
    const webaseData = {
        name: req.body.name || req.body.productName,
        productionDate: req.body.productionDate || "",
        expirationDate: req.body.expirationDate || "",
        productType: req.body.productType,
        barcode: req.body.barcode || "",
    };

    // 用于数据库存储的数据
    const dbData = {
        productName: req.body.name || req.body.productName,
        productType: req.body.productType,
        productNum: parseInt(req.body.productNum) || 1,
        productionDate: req.body.productionDate || "",
        expirationDate: req.body.expirationDate || "",
        barcode: req.body.barcode || "",
        productAddr: ""
    };

    try {
        console.log("准备上链的数据：", webaseData);
        let token = await webase.getUserToken();
        let address = await webase.storeProduct(token, webaseData);
        dbData.productAddr = address;
        console.log("上链成功，获得地址：", address);
    } catch (error) {
        console.error("webase操作失败：" + error.message);
        return res.status(500).send({
            code: "500",
            message: "webase操作失败：" + error.message
        });
    }

    try {
        console.log("准备保存到数据库的数据：", dbData);
        const result = await Goods.create(dbData);
        console.log("商品成功上链并存储到数据库：", result.toJSON());
        return res.status(200).send({
            code: "3002",
            message: "ok!",
            data: result
        });
    } catch (error) {
        console.error("数据库操作失败：" + error.message);
        console.error("错误详情：", error);
        return res.status(500).send({
            code: "500",
            message: "数据库操作失败：" + error.message
        });
    }
}

/**
 * @description: 修改商品状态将检查商品是否被订单占用
 * @param {*} req {productAddr：修改的商品地址。status：商品当前状态}
 * @param {*} res 响应体
 * @return {*} 返回修改信息
 * @requestType: 
 */
exports.changeProductStatus = async(req, res) => {

    const product = {
        status: req.body.status,
        productAddr: req.body.productAddr
    };

    //*检查商品是否参与了订单
    await FormInfo.findAll({
        where: {
            [Op.and]: [{ status: 'on' }, { productAddr: product.productAddr }]
        }

    }).then(data => {
        // console.log(data)
        //!若有则说明被占用，不得修改
        if (data.length != 0) {
            res.status(200).send({
                code: "3006",
                message: "当前商品被运单占用，不得修改状态"
            })
            return
        } else {
            //*没有则允许修改，然检查商品要怎么改，是启用改停用还是反之
            if (product.status === 'on') {
                Goods.update({ status: 'off' }, {
                    where: {
                        [Op.and]: [{ status: 'on' }, { productAddr: product.productAddr }]
                    }
                }).then(() => {
                    res.status(200).send({
                        code: "3005",
                        message: "修改成功！已停用"

                    })
                    return
                })
            } else {
                Goods.update({ status: 'on' }, {
                    where: {
                        [Op.and]: [{ status: 'off' }, { productAddr: product.productAddr }]
                    }
                }).then(() => {
                    res.status(200).send({
                        code: "3005",
                        message: "修改成功！已启用"
                    })
                    return
                })
            }

        }
    }).catch(err => {
        res.status(500).send({
            code: "500",
            message: err
        })
    })

}
exports.testcase = async(req, res) => {
    const productName = req.body.name
    let productInfo = []
    let productAddr = []
    let product = {}
    try {
        let token = await webase.getUserToken();
        let response = await webase.getAllProducts(token);
        productInfo = response[0]
        productAddr = response[1]
    } catch (error) {
        console.error(error)
    }
    for (var i = 0; i < productInfo.length; i++) {
        if (productInfo[i].name == '213') {
            product = productInfo[i]
            product.productAddr = productAddr[i]
        }
    }
    console.log(product)
    await Goods.create(product).then(data => {
        console.log(data)
        res.status(200).send({
            message: "ok"
        })
    }).catch(err => {
        res.status(500).send({
            message: err
        })
    })

}

/**
 * @description: 修改商品数量
 * @param {*} req {id: 商品ID, productNum: 新数量}
 * @param {*} res 响应体
 * @return {*} 返回修改结果
 * @requestType POST
 */
exports.updateProductQuantity = async(req, res) => {
    try {
        const { id, productNum } = req.body;

        if (!id || !productNum) {
            return res.status(400).send({
                code: "400",
                message: "商品ID和数量不能为空"
            });
        }

        const result = await Goods.update({ productNum: parseInt(productNum) }, { where: { id: id } });

        if (result[0] > 0) {
            console.log("商品数量修改成功，ID:", id, "新数量:", productNum);
            return res.status(200).send({
                code: "3003",
                message: "修改成功",
                data: result
            });
        } else {
            return res.status(404).send({
                code: "404",
                message: "商品不存在"
            });
        }
    } catch (error) {
        console.error("修改商品数量失败：" + error.message);
        return res.status(500).send({
            code: "500",
            message: "修改失败：" + error.message
        });
    }
}

/**
 * @description: 删除商品
 * @param {*} req {id: 商品ID}
 * @param {*} res 响应体
 * @return {*} 返回删除结果
 * @requestType POST
 */
exports.deleteProduct = async(req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).send({
                code: "400",
                message: "商品ID不能为空"
            });
        }

        const result = await Goods.destroy({
            where: { id: id }
        });

        if (result > 0) {
            console.log("商品删除成功，ID:", id);
            return res.status(200).send({
                code: "3004",
                message: "删除成功",
                data: result
            });
        } else {
            return res.status(404).send({
                code: "404",
                message: "商品不存在"
            });
        }
    } catch (error) {
        console.error("删除商品失败：" + error.message);
        return res.status(500).send({
            code: "500",
            message: "删除失败：" + error.message
        });
    }
}
