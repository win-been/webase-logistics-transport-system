/**
 * @Author: xpxxy
 * @Description: 表单的所有定义
 */
module.exports = app => {
    // 核心修复：路径改为 ../controller/（单数），与实际目录匹配
    const formRouter = require("../controller/formController.js");
    var router = require("express").Router();

    // 修复拼写错误：chengeFormStatus → changeFormStatus（避免后续回调undefined）
    router.post("/api/createForm", formRouter.createForm);
    router.get("/api/findOneLogisticsInfo", formRouter.findOneLogisticsInfo);
    router.get("/api/findAllLogisticsInfo", formRouter.findAllLogisticsInfo);
    router.get("/api/findForm", formRouter.getFormData);
    router.post('/api/getUserForm', formRouter.getUserForm);
    router.post('/api/searchForm', formRouter.searchFormData);
    router.post('/api/getTransitForm', formRouter.getTransitForm);
    router.post('/api/getAttendForm', formRouter.getAttendForm);
    router.post('/api/updateForm', formRouter.updateForm);
    router.post('/api/changeFormStatus', formRouter.changeFormStatus); // 修正拼写
    router.post('/api/startForm', formRouter.startForm); // 启动表单
    router.post('/api/getAllForm', formRouter.getAllForm);

    app.use('/', router);
};


