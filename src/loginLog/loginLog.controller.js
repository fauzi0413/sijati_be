const express = require('express');
const prisma = require("../db");
const { getAllLoginLog, getLoginLogById, createLoginLog, deleteLoginLogById, editLoginLogById, patchLoginLogById } = require('./loginLog.service');

const router = express.Router();

router.get("/", async (req, res) => {
    const loginLogs = await getAllLoginLog();

    res.send(loginLogs);
});

router.get("/:log_id", async (req, res) => {
    try {
        const loginLog = await getLoginLogById(req.params.log_id);

        res.send(loginLog);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

router.post("/", async (req, res) => {
    try {
        const newLoginLogData = req.body;

        const loginLog = await createLoginLog(newLoginLogData);

        res.send({
            data: loginLog,
            message: "create login success",
        });
    } catch(error) {
        res.status(400).send(error.message);
    }
});

router.delete("/:log_id", async (req, res) => {
    try {
        const logId = req.params.log_id;

        await deleteLoginLogById(logId);

        res.send("login log deleted");
    } catch (error) {
        res.status(400).send(error.message)
    }
});

router.put("/:log_id", async (req, res) => {
    const logId = req.params.log_id;
    const newLoginLogData = req.body;

    if (!newLoginLogData.ip_address) {
    return res.status(400).send("ip address is required");
    }
    if (!newLoginLogData.user_agent) {
    return res.status(400).send("user agent is required");
    }
    if (!newLoginLogData.status) {
    return res.status(400).send("status is required");
    }
    if (!newLoginLogData.failure_reason) {
    return res.status(400).send("failure reason is required");
    }

    const loginLog = await editLoginLogById(logId, newLoginLogData);

    res.send({
        data: loginLog,
        message: "edit login log success",
    })
});

router.patch("/:log_id", async (req, res) => {
    try {
        const logId = req.params.log_id;
        const newLoginLogData = req.body;

        const loginLog = await patchLoginLogById(logId, newLoginLogData);

        res.send({
            data: loginLog,
            message: "edit login log success",
        });
    } catch (err) {
        res.status(400).send(err.message);
    }
});

module.exports = router;